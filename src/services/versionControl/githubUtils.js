/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */
import { Base64 } from 'js-base64'
import { removeIgnoredFields } from './dataSanitization'
import { getFileTypeFromFileName } from './versionControlFiles'

export async function getFile(path) {
  const { data: file } = await this.octokit.rest.repos.getContent({
    owner: this.owner,
    repo: this.repo,
    path,
    ref: this.defaultBranch,
  })

  if (!file.content || file.size > 100 * 1024) {
    // Large files
    const { data: blobData } = await this.octokit.rest.git.getBlob({
      owner: this.owner,
      repo: this.repo,
      file_sha: file.sha,
    })
    file.content = blobData.content
  }
  return file
}

export async function getCommitFiles(sha) {
  const { data: commitData } = await this.octokit.rest.repos.getCommit({
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
      const content = await this.fetchFileContent(file.contents_url)
      const fileType = getFileTypeFromFileName(file.filename)
      return { ...file, content: JSON.parse(Base64.decode(content)), fileType }
    }),
  )
}

export async function fetchFileContent(contents_url) {
  const { data: response } = await this.octokit.request(contents_url)

  if (!response || !response.content) {
    const { data: blobData } = await this.octokit.rest.git.getBlob({
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

export async function branchExists(branchName) {
  const { data: branches } = await this.octokit.rest.repos.listBranches({
    owner: this.owner,
    repo: this.repo,
  })

  return branches.some((branch) => branch.name === branchName)
}

export async function createBranch(branchName) {
  if (!branchName) {
    throw new Error('Branch name is required')
  }

  const exists = await this.branchExists(branchName)
  const sourceBranch = 'main' // or use predefined default branch

  if (!exists) {
    const { data: mainBranch } = await this.octokit.rest.repos.getBranch({
      owner: this.owner,
      repo: this.repo,
      branch: sourceBranch,
    })

    await this.octokit.rest.git.createRef({
      owner: this.owner,
      repo: this.repo,
      ref: `refs/heads/${branchName}`,
      sha: mainBranch.commit.sha,
    })
  }
}

export async function updateFilesInSingleCommit(commitMessage, files) {
  const { data: refData } = await this.octokit.rest.git.getRef({
    owner: this.owner,
    repo: this.repo,
    ref: `heads/${this.defaultBranch}`,
  })

  const baseTreeSha = refData.object.sha

  const blobs = await Promise.all(
    files.map(async (file) => {
      const { data } = await this.octokit.rest.git.createBlob({
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

  const { data: newTree } = await this.octokit.rest.git.createTree({
    owner: this.owner,
    repo: this.repo,
    tree: blobs,
    base_tree: baseTreeSha,
  })

  const { data: newCommit } = await this.octokit.rest.git.createCommit({
    owner: this.owner,
    repo: this.repo,
    message: commitMessage,
    tree: newTree.sha,
    parents: [baseTreeSha],
  })

  await this.octokit.rest.git.updateRef({
    owner: this.owner,
    repo: this.repo,
    ref: `heads/${this.defaultBranch}`,
    sha: newCommit.sha,
  })
}

export async function updateGitFileContent(filePath, cdcFileContent) {
  let getGitFileInfo

  try {
    const branchExists = await this.branchExists(this.defaultBranch)
    if (!branchExists) {
      throw new Error('Branch does not exist')
    }

    getGitFileInfo = await this.getFile(filePath)
  } catch (error) {
    if (error.status === 404 || error.message === 'Branch does not exist') {
      console.log(`Creating new file: ${filePath}`)
      return {
        path: filePath,
        content: cdcFileContent,
        sha: undefined,
      }
    }
    throw error
  }

  const rawGitContent = getGitFileInfo ? getGitFileInfo.content : '{}'
  let currentGitContent
  const currentGitContentDecoded = Base64.decode(rawGitContent)
  if (currentGitContentDecoded) {
    try {
      currentGitContent = JSON.parse(currentGitContentDecoded)
      currentGitContent = removeIgnoredFields(currentGitContent)
    } catch {
      currentGitContent = {}
    }
  }

  let newContent = JSON.parse(cdcFileContent)
  newContent = removeIgnoredFields(newContent)

  if (JSON.stringify(currentGitContent) !== JSON.stringify(newContent)) {
    console.log(`Differences found, proceeding to update file: ${filePath}`)
    return {
      path: filePath,
      content: cdcFileContent,
      sha: getGitFileInfo ? getGitFileInfo.sha : undefined,
    }
  } else {
    console.log(`Files ${filePath} are identical. Skipping update.`)
    return null
  }
}

export async function storeCdcDataInGit(commitMessage) {
  const configs = await this.fetchCDCConfigs()
  const files = Object.keys(configs).map((key) => ({
    path: `src/versionControl/${key}.json`,
    content: JSON.stringify(configs[key], null, 2),
  }))

  const fileUpdates = await Promise.all(
    files.map(async (file) => {
      return this.updateGitFileContent(file.path, file.content)
    }),
  )

  const validUpdates = fileUpdates.filter((update) => update !== null)
  if (validUpdates.length > 0) {
    await this.updateFilesInSingleCommit(commitMessage, validUpdates)
  } else {
    console.log('No files to update. Skipping commit.')
  }
}

export async function getCommits(page = 1, per_page = 10) {
  try {
    const { data } = await this.octokit.rest.repos.listCommits({
      owner: this.owner,
      repo: this.repo,
      sha: this.defaultBranch,
      per_page,
      page,
    })
    return data
  } catch (error) {
    console.error(`Failed to fetch commits for branch: ${this.defaultBranch}`, error)
    throw error
  }
}
