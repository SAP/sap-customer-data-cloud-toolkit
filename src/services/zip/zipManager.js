/*
 * Copyright (c) 2023 SAP SE or an SAP affiliate company.
 * All rights reserved.
 *
 * This software is the confidential and proprietary information of SAP
 * ("Confidential Information"). You shall not disclose such Confidential
 * Information and shall use it only in accordance with the terms of the
 * license agreement you entered into with SAP.
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
    const zip = new JSZip()
    const contents = await zip.loadAsync(zipContent)

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
