//import AdmZip from 'adm-zip'
import JSZip from 'jszip'

class ZipManager {
  static #zipFile
  constructor() {
    if (ZipManager.#zipFile === undefined) {
      //ZipManager.#zipFile = new AdmZip()
      ZipManager.#zipFile = new JSZip()
    }
  }

  //   static getInstance() {
  //     if (ZipManager.#zipFile === undefined) {
  //       ZipManager.#zipFile = new AdmZip()
  //     }
  //     return new ZipManager()
  //   }

  createFile(template, name, content) {
    //ZipManager.#zipFile.addFile(`${template}/${name}.html`, Buffer.from(content, 'utf8'))
    ZipManager.#zipFile.file(`${template}/${name}.html`, Buffer.from(content, 'utf8'))
    return `${template}/${name}.html`
  }

  create(name, content) {
    //ZipManager.#zipFile.addFile(`${name}.html`, Buffer.from(content, 'utf8'))
    ZipManager.#zipFile.file(`${name}.html`, Buffer.from(content, 'utf8'))
    return `${name}.html`
  }

  createZipArchive() {
    //return ZipManager.#zipFile.toBuffer()
    return ZipManager.#zipFile.generateAsync({ type: 'string' })
  }

  clear() {
    ZipManager.#zipFile = undefined
  }
}

export default ZipManager
