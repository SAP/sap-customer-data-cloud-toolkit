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
    const MAX_FILES = 10000
    const MAX_SIZE = 100000000

    let fileCount = 0
    let totalSize = 0
    const zip = new JSZip()
    console.log('zipContent', await zipContent)
    const contents = await zip.loadAsync(zipContent).then(function (zip) {
      console.log('zip', zip)
      zip.forEach(function (relativePath, zipEntry) {
        console.log('relativePath', relativePath)
        console.log('file', zipEntry)
        if (fileCount > MAX_FILES) {
          throw 'Reached max. number of files'
        }
      })
    })

    const promises = []
    Object.keys(contents.files).forEach(function (filename) {
      const entry = zip.files[filename]
      if (!entry.dir) {
        promises.push(filename)
        promises.push(entry.async('string')) // get entry file content
      }
    })

    const newContentMap = new Map()
    return Promise.all(promises)
      .then((fileContent) => {
        return fileContent
      })
      .then((entries) => {
        for (let i = 0; i < entries.length; i += 2) {
          newContentMap.set(entries[i], entries[i + 1])
        }
        return newContentMap
      })
  }
}

export default ZipManager
