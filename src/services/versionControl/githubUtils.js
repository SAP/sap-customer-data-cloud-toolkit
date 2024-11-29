/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */
import { Base64 } from 'js-base64'
import { removeIgnoredFields } from './dataSanitization'
import { getFileTypeFromFileName } from './versionControlFiles'

export const getFile = async function (path) {
  const { data: file } = await this.octokit.rest.repos.getContent({
    owner: this.owner,
    repo: this.repo,
    path,
    ref: this.defaultBranch,
  })

  if (!file.content || file.size > 100 * 1024) {
    const { data: blobData } = await this.octokit.rest.git.getBlob({
      owner: this.owner,
      repo: this.repo,
      file_sha: file.sha,
    })
    file.content = blobData.content
  }

  if (!file.content) {
    throw new Error(`Failed to retrieve content for path: ${path}`)
  }

  return file
}

export const getCommitFiles = async function (sha) {
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

  const fileContentsPromises = files.map(async (file) => {
    const content = await this.fetchFileContent(file.contents_url)
    return { ...file, content: JSON.parse(Base64.decode(content)) }
  })

  return Promise.all(fileContentsPromises)
}

export const createBranch = async function (branchName) {
  const branches = await this.octokit.rest.repos.listBranches({
    owner: this.owner,
    repo: this.repo,
  })

  const branchExists = branches.data.some((branch) => branch.name === branchName)

  if (!branchExists) {
    const mainBranch = await this.octokit.rest.repos.getBranch({
      owner: this.owner,
      repo: this.repo,
      branch: this.defaultBranch,
    })

    await this.octokit.rest.git.createRef({
      owner: this.owner,
      repo: this.repo,
      ref: `refs/heads/${branchName}`,
      sha: mainBranch.data.commit.sha,
    })
  }
}

export const updateFilesInSingleCommit = async function (commitMessage, files) {
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

// Moved functions
export const updateGitFileContent = async function (filePath, cdcFileContent) {
  const plainCdcContent = cdcFileContent
  let getGitFileInfo = await this.getFile(filePath)

  if (!getGitFileInfo) {
    console.log(`Creating new file: ${filePath}`)
    getGitFileInfo = { content: '{}', sha: undefined }
  }

  const rawGitContent = getGitFileInfo.content
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
      content: plainCdcContent,
      sha: getGitFileInfo.sha,
    }
  } else {
    console.log(`Files ${filePath} are identical. Skipping update.`)
    return null
  }
}

export const storeCdcDataInGit = async function (commitMessage) {
  const configs = await this.fetchCDCConfigs()
  const files = Object.keys(configs).map((key) => ({
    path: `src/versionControl/${key}.json`,
    content: JSON.stringify(configs[key], null, 2),
  }))

  const fileUpdates = await Promise.all(
    files.map(async (file) => {
      const updateFile = await this.updateGitFileContent(file.path, file.content)
      return updateFile
    }),
  )

  const validUpdates = fileUpdates.filter((update) => update !== null)
  if (validUpdates.length > 0) {
    await this.updateFilesInSingleCommit(commitMessage, validUpdates)
  } else {
    console.log('No files to update. Skipping commit.')
  }
}

export const fetchFileContent = async function (contents_url) {
  const { data: response } = await this.octokit.request(contents_url)
  if (!response || !response.content) {
    const { sha } = response
    const { data: blobData } = await this.octokit.rest.git.getBlob({
      owner: this.owner,
      repo: this.repo,
      file_sha: sha,
    })
    if (!blobData || !blobData.content) {
      throw new Error(`Failed to fetch blob content for URL: ${contents_url}`)
    }
    return blobData.content
  }
  return response.content
}

export const getCommits = async function () {
  let allCommits = []
  let page = 1
  const per_page = 100

  while (true) {
    const { data } = await this.octokit.rest.repos.listCommits({
      owner: this.owner,
      repo: this.repo,
      sha: this.defaultBranch,
      per_page,
      page,
    })

    if (data.length === 0) break

    allCommits = allCommits.concat(data)

    if (data.length < per_page) break

    page += 1
  }

  return allCommits
}

export const applyCommitConfig = async function (commitSha) {
  const files = await getCommitFiles(commitSha)
  for (let file of files) {
    const fileType = getFileTypeFromFileName(file.filename)
    const filteredResponse = file.content

    switch (fileType) {
      case 'webSdk':
        await this.setWebSDK(filteredResponse)
        break
      case 'dataflow':
        await this.setDataflow(filteredResponse)
        break
      case 'emails':
        await this.setEmailTemplates(filteredResponse)
        break
      case 'extension':
        await this.setExtension(filteredResponse)
        break
      case 'policies':
        await this.setPolicies(filteredResponse)
        break
      case 'rba':
        await this.setRBA(filteredResponse)
        break
      case 'riskAssessment':
        await this.setRiskAssessment(filteredResponse)
        break
      case 'schema':
        await this.setSchema(filteredResponse)
        break
      case 'sets':
        await this.setScreenSets(filteredResponse)
        break
      case 'sms':
        await this.setSMS(filteredResponse)
        break
      case 'channel':
        await this.setChannel(filteredResponse)
        break
      default:
        console.warn(`Unknown file type: ${fileType}`)
    }
  }
}
