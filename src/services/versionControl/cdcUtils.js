/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */
import { Base64 } from 'js-base64'
import { removeIgnoredFields } from './dataSanitization'
import { getFileTypeFromFileName } from './versionControlFiles'

export const getCdcData = function () {
  const responses = [
    { name: 'webSdk', promise: this.webSdk.get() },
    { name: 'dataflow', promise: this.dataflow.search() },
    { name: 'emails', promise: this.emails.get() },
    { name: 'extension', promise: this.extension.get() },
    { name: 'policies', promise: this.policies.get() },
    { name: 'rba', promise: this.rba.get() },
    { name: 'riskAssessment', promise: this.riskAssessment.get() },
    { name: 'schema', promise: this.schema.get() },
    { name: 'sets', promise: this.screenSets.get() },
    { name: 'sms', promise: this.sms.get() },
    { name: 'channel', promise: this.channel.get() },
  ]
  return responses
}

export const fetchCDCConfigs = async function () {
  const cdcDataArray = this.getCdcData()
  if (!Array.isArray(cdcDataArray)) {
    throw new Error('getCdcData must return an array')
  }
  const cdcData = await Promise.all(
    cdcDataArray.map(async ({ name, promise }) => {
      const data = await promise
      return { [name]: data }
    }),
  )
  return Object.assign({}, ...cdcData)
}

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

export const applyCommitConfig = async function (commitSha) {
  const files = await this.getCommitFiles(commitSha)
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
