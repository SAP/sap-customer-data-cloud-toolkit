/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */

import JSZip from 'jszip'
import { Buffer } from 'buffer'

class ZipManager {
  #zipFile

  constructor() {
    this.#zipFile = new JSZip()
  }

  createFile(template, name, content) {
    this.#zipFile.file(`${template}/${name}`, Buffer.from(content, 'utf8'))
    return `${template}/${name}`
  }

  create(name, content) {
    this.#zipFile.file(`${name}`, Buffer.from(content, 'utf8'))
    return `${name}`
  }

  createFolder(name) {
    return this.#zipFile.folder(`${name}`)
  }

  createZipArchive() {
    return this.#zipFile.generateAsync({ type: 'arraybuffer' })
  }

  async read(zipContent) {
    const MAX_DIRECTORIES = 20
    const MAX_NUMBER_OF_LANGUAGES = 50
    const MAX_FILES = MAX_DIRECTORIES * MAX_NUMBER_OF_LANGUAGES
    const MAX_TOTAL_UNCOMPRESSED_SIZE = 200 * 1024 * 1024
    let fileCount = 0
    let totalUncompressedSize = 0
    const newContentMap = new Map()
    const promises = []
    const zip = new JSZip()
    const content = await zip.loadAsync(zipContent).then(async function (zip) {
      zip.forEach(function (relativePath, zipEntry) {
        fileCount++
        if (!zipEntry.dir) {
          const fileSize = zipEntry._data.uncompressedSize // Size in bytes
          totalUncompressedSize += fileSize
          if (totalUncompressedSize > MAX_TOTAL_UNCOMPRESSED_SIZE) {
            throw new Error(`Exceeded maximum allowed file size: ${MAX_TOTAL_UNCOMPRESSED_SIZE}`)
          }
          promises.push(zipEntry.name)
          promises.push(zipEntry.async('string'))
        }
        if (fileCount > MAX_FILES) {
          throw new Error('Unexpected zip file content: Exceeded maximum allowed files')
        }
      })
      const fileContent = await Promise.all(promises)
      for (let i = 0; i < fileContent.length; i += 2) {
        newContentMap.set(fileContent[i], fileContent[i + 1])
      }
      return newContentMap
    })
    return content
  }
}

export default ZipManager
