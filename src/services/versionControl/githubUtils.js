/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */
import { Base64 } from 'js-base64'
import { removeIgnoredFields } from './dataSanitization'
import CdcService from './cdcService'

export async function getFile(versionControl, path) {
  const { data: file } =
    (await versionControl.octokit.rest.repos.getContent({
      owner: versionControl.owner,
      repo: versionControl.repo,
      path,
      ref: versionControl.defaultBranch,
    })) || {}

  if (!file || !file.content || file.size > 100 * 1024) {
    const { data: blobData } =
      (await versionControl.octokit.rest.git.getBlob({
        owner: versionControl.owner,
        repo: versionControl.repo,
        file_sha: file && file.sha,
      })) || {}
    file.content = blobData ? blobData.content : null
  }
  return file
}

export async function getCommitFiles(versionControl, sha) {
  const { data: commitData } = await versionControl.octokit.rest.repos.getCommit({
    owner: versionControl.owner,
    repo: versionControl.repo,
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
      const content = await fetchFileContent(versionControl, file.contents_url)
      return { ...file, content: JSON.parse(Base64.decode(content)) }
    }),
  )
}

export async function fetchFileContent(versionControl, contents_url) {
  const { data: response } = await versionControl.octokit.request(contents_url)

  if (!response || !response.content) {
    const { data: blobData } = await versionControl.octokit.rest.git.getBlob({
      owner: versionControl.owner,
      repo: versionControl.repo,
      file_sha: response.sha,
    })

    if (!blobData.content) {
      throw new Error(`Failed to fetch blob content for URL: ${contents_url}`)
    }
    return blobData.content
  }
  return response.content
}

export async function branchExists(versionControl, branchName) {
  const { data: branches } =
    (await versionControl.octokit.rest.repos.listBranches({
      owner: versionControl.owner,
      repo: versionControl.repo,
    })) || {}

  return branches ? branches.some((branch) => branch.name === branchName) : false
}

export async function createBranch(versionControl, branchName) {
  if (!branchName) {
    throw new Error('Branch name is required')
  }

  const exists = await branchExists(versionControl, branchName)
  const sourceBranch = 'main' // or use predefined default branch

  if (!exists) {
    const { data: mainBranch } = await versionControl.octokit.rest.repos.getBranch({
      owner: versionControl.owner,
      repo: versionControl.repo,
      branch: sourceBranch,
    })

    await versionControl.octokit.rest.git.createRef({
      owner: versionControl.owner,
      repo: versionControl.repo,
      ref: `refs/heads/${branchName}`,
      sha: mainBranch.commit.sha,
    })
  }
}

export async function updateFilesInSingleCommit(versionControl, commitMessage, files) {
  const { data: refData } = await versionControl.octokit.rest.git.getRef({
    owner: versionControl.owner,
    repo: versionControl.repo,
    ref: `heads/${versionControl.defaultBranch}`,
  })

  const baseTreeSha = refData.object.sha

  const blobs = await Promise.all(
    files.map(async (file) => {
      const { data } = await versionControl.octokit.rest.git.createBlob({
        owner: versionControl.owner,
        repo: versionControl.repo,
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

  const { data: newTree } = await versionControl.octokit.rest.git.createTree({
    owner: versionControl.owner,
    repo: versionControl.repo,
    tree: blobs,
    base_tree: baseTreeSha,
  })

  const { data: newCommit } = await versionControl.octokit.rest.git.createCommit({
    owner: versionControl.owner,
    repo: versionControl.repo,
    message: commitMessage,
    tree: newTree.sha,
    parents: [baseTreeSha],
  })

  await versionControl.octokit.rest.git.updateRef({
    owner: versionControl.owner,
    repo: versionControl.repo,
    ref: `heads/${versionControl.defaultBranch}`,
    sha: newCommit.sha,
    force: true, // Force update to handle non-fast-forward updates
  })
}

export async function updateGitFileContent(versionControl, filePath, cdcFileContent) {
  let getGitFileInfo

  try {
    const branchExistsResult = await branchExists(versionControl, versionControl.defaultBranch)
    if (!branchExistsResult) {
      throw new Error('Branch does not exist')
    }

    getGitFileInfo = await getFile(versionControl, filePath)
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

  if (JSON.stringify(currentGitContent) !== JSON.stringify(sanitizedNewContent)) {
    return {
      path: filePath,
      content: JSON.stringify(newContent, null, 2), // Save the original content
      sha: getGitFileInfo ? getGitFileInfo.sha : undefined,
    }
  } else {
    return null
  }
}

export async function getCommits(versionControl) {
  let allCommits = []
  let page = 1
  const per_page = 100 // Maximum allowed per page

  while (true) {
    try {
      const response = await versionControl.octokit.rest.repos.listCommits({
        owner: versionControl.owner,
        repo: versionControl.repo,
        sha: versionControl.defaultBranch,
        per_page,
        page,
      })

      allCommits = allCommits.concat(response.data)

      if (response.data.length < per_page) {
        break // No more pages to fetch
      }

      page += 1
    } catch (error) {
      console.error(`Failed to fetch commits for branch: ${versionControl.defaultBranch}`, error)
      throw error
    }
  }

  return { data: allCommits }
}

export async function fetchAndPrepareFiles(versionControl) {
  const cdcService = new CdcService(versionControl)
  const configs = await cdcService.fetchCDCConfigs()

  const files = Object.keys(configs).map((key) => ({
    path: `src/versionControl/${key}.json`,
    content: JSON.stringify(configs[key], null, 2),
  }))

  const fileUpdates = await Promise.all(
    files.map(async (file) => {
      const result = await updateGitFileContent(versionControl, file.path, file.content)
      return result
    }),
  )

  return fileUpdates.filter((update) => update !== null)
}

export async function prepareFilesForUpdate(versionControl) {
  const validUpdates = await fetchAndPrepareFiles(versionControl)
  const formattedFiles = validUpdates.length > 0 ? validUpdates.map((file) => file.path.replace('src/versionControl/', '').replace('.json', '')) : ['N/A']
  return formattedFiles
}

export async function storeCdcDataInGit(versionControl, commitMessage) {
  const validUpdates = await fetchAndPrepareFiles(versionControl)
  if (validUpdates.length > 0) {
    await updateFilesInSingleCommit(versionControl, commitMessage, validUpdates)
  } else {
    console.log('No files to update. Skipping commit.')
  }
}
