/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */

import VersionControlManager from './versionControlManager'
import { removeIgnoredFields } from '../dataSanitization'
import _ from 'lodash'
import { Base64 } from 'js-base64'
import { skipForChildSite, generateFileObjects } from '../utils'

class GitHub extends VersionControlManager {
  static #SOURCE_BRANCH = 'main'

  async hasBranch(branchName) {
    try {
      const { data: branches } = await this.versionControl.rest.repos.listBranches({
        owner: this.owner,
        repo: this.repo,
      })
      return branches ? branches.some((branch) => branch.name === branchName) : false
    } catch (error) {
      throw new Error(error.message)
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
      const per_page = 100
      const hasBranch = await this.hasBranch(apiKey)
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
              break
            }

            page += 1
          } catch (error) {
            throw Error(`Failed to fetch commits for branch: ${apiKey}`, error)
          }
        }
        return { data: allCommits }
      }
      return { data: [] }
    } catch (error) {
      throw new Error(error)
    }
  }

  async storeCdcDataInVersionControl(commitMessage, configs, apiKey, siteInfo) {
    await this.#createBranch(apiKey)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    const validUpdates = await this.fetchFilesAndUpdateGitContent(configs, apiKey, siteInfo)
    if (validUpdates.length > 0) {
      await this.#updateFilesInSingleCommit(commitMessage, validUpdates, apiKey)
    }
  }

  async fetchFilesAndUpdateGitContent(configs, apiKey, siteInfo) {
    const files = generateFileObjects(configs)
    const branchExistsResult = await this.hasBranch(apiKey)
    let result = []

    if (branchExistsResult) {
      const fileResults = await Promise.all(
        files.map(async (file) => {
          return await this.#updateGitFileContent(file.path, file.content, apiKey, siteInfo)
        }),
      )
      result = [...fileResults]
    } else {
      const fileResults = files.map((file) => {
        return {
          path: file.path,
          content: file.content,
          sha: undefined,
        }
      })
      result = [...fileResults]
    }

    return result.filter((update) => update !== null)
  }

  async #createBranch(apiKey) {
    if (!apiKey) {
      throw new Error('API key is missing')
    }
    const branchExists = await this.hasBranch(apiKey)
    if (!branchExists) {
      this.#getMainBranchAndCreateRef(apiKey)
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
    })
  }

  async #updateGitFileContent(filePath, cdcFileContent, defaultBranch, siteInfo) {
    let getGitFileInfo = await this.#getFile(filePath, defaultBranch)
    const rawGitContent = getGitFileInfo.content
    let currentGitContent = {}
    const currentGitContentDecoded = rawGitContent ? Base64.decode(rawGitContent) : '{}'
    const filedsToBeIgnored = ['callId', 'time', 'lastModified', 'version', 'context', 'errorCode', 'apiVersion', 'statusCode', 'statusReason']

    if (currentGitContentDecoded) {
      try {
        currentGitContent = JSON.parse(currentGitContentDecoded)
        currentGitContent = removeIgnoredFields(currentGitContent, filedsToBeIgnored)
      } catch (error) {
        currentGitContent = {}
      }
    }

    let newContent = JSON.parse(cdcFileContent)
    const sanitizedNewContent = removeIgnoredFields(newContent, filedsToBeIgnored)

    if (!_.isEqual(currentGitContent, sanitizedNewContent) && skipForChildSite(getGitFileInfo, siteInfo)) {
      const fieldsToBeRemoved = ['callId', 'context', 'errorCode', 'apiVersion', 'statusCode', 'statusReason', 'time']

      newContent = removeIgnoredFields(newContent, fieldsToBeRemoved)

      return {
        path: filePath,
        content: JSON.stringify(newContent, null, 2),
        sha: getGitFileInfo ? getGitFileInfo.sha : undefined,
      }
    } else {
      return null
    }
  }

  async #getMainBranch() {
    try {
      const { data: mainBranch } = await this.versionControl.rest.repos.getBranch({
        owner: this.owner,
        repo: this.repo,
        branch: GitHub.#SOURCE_BRANCH,
      })
      return mainBranch
    } catch (error) {
      throw new Error('There is no main branch for this repository')
    }
  }

  async #createRef(branch, sha) {
    try {
      await this.versionControl.rest.git.createRef({
        owner: this.owner,
        repo: this.repo,
        ref: `refs/heads/${branch}`,
        sha,
      })
    } catch (error) {
      throw new Error(`Error creating ref: ${error.message}`)
    }
  }

  async #getMainBranchAndCreateRef(branch) {
    try {
      const mainBranch = await this.#getMainBranch()
      await this.#createRef(branch, mainBranch.commit.sha)
    } catch (error) {
      throw new Error(`Error in getMainBranchAndCreateRef: ${error.message}`)
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

  async validateVersionControlCredentials() {
    try {
      const { data: authenticatedUser } = await this.versionControl.rest.users.getAuthenticated()
      if (authenticatedUser.login.toLowerCase() !== this.owner.toLowerCase()) {
        throw new Error('Invalid Credentials')
      }

      await this.#getMainBranch()
      return true
    } catch (error) {
      if (error.message.includes('Bad credentials')) {
        throw new Error('Invalid Credentials')
      } else {
        throw new Error(error.message)
      }
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
