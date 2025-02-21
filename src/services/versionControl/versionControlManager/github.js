/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */

import VersionControlManager from './versionControlManager'
import { Base64 } from 'js-base64'
import { deepEqual, removeIgnoredFields } from '../dataSanitization'

class GitHub extends VersionControlManager {
  static #SOURCE_BRANCH = 'main'

  async listBranches(branchName) {
    try {
      const credentialsValid = await this.#validateCredentials()
      if (!credentialsValid) {
        return false
      }
      const { data: branches } = await this.versionControl.rest.repos.listBranches({
        owner: this.owner,
        repo: this.repo,
      })
      return branches ? branches.some((branch) => branch.name === branchName) : false
    } catch (error) {
      throw new Error(error)
    }
  }

  async getCommitFiles(sha) {
    const { data: commitData } = await this.versionControl.rest.repos.getCommit({
      owner: this.owner,
      repo: this.repo,
      ref: sha,
    })

    if (!commitData.files) {
      throw new Error(`No files found in commit: ${sha}`)
    }

    const files = commitData.files.map((file) => ({
      filename: file.filename,
      contents_url: file.contents_url,
    }))

    return Promise.all(
      files.map(async (file) => {
        const content = await this.#fetchFileContent(file.contents_url)
        return { ...file, content: JSON.parse(Base64.decode(content)) }
      }),
    )
  }

  async getCommits(apiKey) {
    try {
      let allCommits = []
      let page = 1
      const per_page = 100 // Maximum allowed per page
      const hasBranch = await this.listBranches(apiKey)
      if (hasBranch) {
        while (true) {
          try {
            const response = await this.versionControl.rest.repos.listCommits({
              owner: this.owner,
              repo: this.repo,
              sha: apiKey,
              per_page,
              page,
            })

            allCommits = allCommits.concat(response.data)

            if (response.data.length < per_page) {
              break // No more pages to fetch
            }

            page += 1
          } catch (error) {
            console.error(`Failed to fetch commits for branch: ${apiKey}`, error)
            throw error
          }
        }
        return { data: allCommits }
      }
      return { data: [] }
    } catch (error) {
      throw new Error(error)
    }
  }
  async waitForCreation(apiKey, delay = 1000) {
    await this.listBranches(apiKey)

    await new Promise((resolve) => setTimeout(resolve, delay))
  }

  async storeCdcDataInVersionControl(commitMessage, configs, apiKey) {
    await this.#createBranch(apiKey)
    const commits = await this.getCommits(apiKey)
    if (commits.data.length === 0) {
      await this.waitForCreation(apiKey)
    }
    const validUpdates = await this.fetchAndPrepareFiles(configs, apiKey)
    if (validUpdates.length > 0) {
      await this.#updateFilesInSingleCommit(commitMessage, validUpdates, apiKey)
    }
  }

  async fetchAndPrepareFiles(configs, apiKey) {
    const files = Object.keys(configs).map((key) => ({
      path: `src/versionControl/${key}.json`,
      content: JSON.stringify(configs[key], null, 2),
    }))
    const fileUpdates = await Promise.all(
      files.map(async (file) => {
        const result = await this.#updateGitFileContent(file.path, file.content, apiKey)
        return result
      }),
    )
    return fileUpdates.filter((update) => update !== null)
  }

  async #createBranch(apiKey) {
    if (!apiKey) {
      throw new Error('API key is missing')
    }
    const branchExists = await this.listBranches(apiKey)
    if (!branchExists) {
      this.#getBranchAndCreateRef(apiKey)
    }
  }

  async #updateFilesInSingleCommit(commitMessage, files, defaultBranch) {
    const { data: refData } = await this.versionControl.rest.git.getRef({
      owner: this.owner,
      repo: this.repo,
      ref: `heads/${defaultBranch}`,
    })

    const baseTreeSha = refData.object.sha

    const blobs = await Promise.all(
      files.map(async (file) => {
        const { data } = await this.versionControl.rest.git.createBlob({
          owner: this.owner,
          repo: this.repo,
          content: file.content,
          encoding: 'utf-8',
        })
        return {
          path: file.path,
          mode: '100644',
          type: 'blob',
          sha: data.sha,
        }
      }),
    )

    const { data: newTree } = await this.versionControl.rest.git.createTree({
      owner: this.owner,
      repo: this.repo,
      tree: blobs,
      base_tree: baseTreeSha,
    })

    const { data: newCommit } = await this.versionControl.rest.git.createCommit({
      owner: this.owner,
      repo: this.repo,
      message: commitMessage,
      tree: newTree.sha,
      parents: [baseTreeSha],
    })

    await this.versionControl.rest.git.updateRef({
      owner: this.owner,
      repo: this.repo,
      ref: `heads/${defaultBranch}`,
      sha: newCommit.sha,
      force: true,
    })
  }

  async #updateGitFileContent(filePath, cdcFileContent, defaultBranch) {
    let getGitFileInfo

    try {
      const branchExistsResult = await this.listBranches(defaultBranch)
      if (!branchExistsResult) {
        throw new Error('Branch does not exist')
      }

      getGitFileInfo = await this.#getFile(filePath, defaultBranch)
    } catch (error) {
      if (error.status === 404 || error.message === 'Branch does not exist') {
        return {
          path: filePath,
          content: cdcFileContent,
          sha: undefined,
        }
      }
      throw error
    }

    const rawGitContent = getGitFileInfo ? getGitFileInfo.content : '{}'
    let currentGitContent = {}
    const currentGitContentDecoded = rawGitContent ? Base64.decode(rawGitContent) : '{}'
    if (currentGitContentDecoded) {
      try {
        currentGitContent = JSON.parse(currentGitContentDecoded)
        currentGitContent = removeIgnoredFields(currentGitContent)
      } catch (error) {
        currentGitContent = {}
      }
    }

    let newContent = JSON.parse(cdcFileContent)
    const sanitizedNewContent = removeIgnoredFields(newContent)
    if (!deepEqual(currentGitContent, sanitizedNewContent)) {
      return {
        path: filePath,
        content: JSON.stringify(newContent, null, 2), // Save the original content
        sha: getGitFileInfo ? getGitFileInfo.sha : undefined,
      }
    } else {
      return null
    }
  }

  async #getBranchAndCreateRef(branch) {
    try {
      const { data: mainBranch } = await this.versionControl.rest.repos.getBranch({
        owner: this.owner,
        repo: this.repo,
        branch: GitHub.#SOURCE_BRANCH,
      })
      await this.versionControl.rest.git.createRef({
        owner: this.owner,
        repo: this.repo,
        ref: `refs/heads/${branch}`,
        sha: mainBranch.commit.sha,
      })
    } catch (error) {
      throw new Error('Error fetching branch:', error)
    }
  }

  async #getFile(path, defaultBranch) {
    const { data: file } = await this.versionControl.rest.repos.getContent({
      owner: this.owner,
      repo: this.repo,
      path,
      ref: defaultBranch,
    })

    if (!file || !file.content || file.size > 100 * 1024) {
      const { data: blobData } =
        (await this.versionControl.rest.git.getBlob({
          owner: this.owner,
          repo: this.repo,
          file_sha: file && file.sha,
        })) || {}
      file.content = blobData ? blobData.content : null
    }
    return file
  }

  async #validateCredentials() {
    try {
      const { data: authenticatedUser } = await this.versionControl.rest.users.getAuthenticated()
      if (authenticatedUser.login.toLowerCase() !== this.owner.toLowerCase()) {
        throw new Error('Invalid owner')
      }
      return true
    } catch (error) {
      throw new Error(error)
    }
  }

  async #fetchFileContent(contents_url) {
    const { data: response } = await this.versionControl.request(contents_url)
    if (!response || !response.content) {
      const { data: blobData } = await await this.versionControl.rest.git.getBlob({
        owner: this.owner,
        repo: this.repo,
        file_sha: response.sha,
      })

      if (!blobData.content) {
        throw new Error(`Failed to fetch blob content for URL: ${contents_url}`)
      }
      return blobData.content
    }
    return response.content
  }
}

export default GitHub
