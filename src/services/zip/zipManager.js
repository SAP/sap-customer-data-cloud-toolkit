import JSZip from 'jszip'
import { Buffer } from 'buffer'

class ZipManager {
  #zipFile

  constructor() {
    this.#zipFile = new JSZip()
  }

  createFile(template, name, content) {
    this.#zipFile.file(`${template}/${name}.html`, Buffer.from(content, 'utf8'))
    return `${template}/${name}.html`
  }

  create(name, content) {
    this.#zipFile.file(`${name}`, Buffer.from(content, 'utf8'))
    return `${name}`
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
