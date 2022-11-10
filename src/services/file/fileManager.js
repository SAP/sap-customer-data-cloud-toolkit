import os from 'os'
import fs from 'fs'
import AdmZip from 'adm-zip'

class FileManager {
  static #OS_TEMP_DIR_PATH = os.tmpdir()
  //static #DIR = `${File.#OS_TEMP_DIR_PATH}/cdc-tools-chrome-extension`

  constructor(dir) {
    this.dir = `${FileManager.#OS_TEMP_DIR_PATH}/${dir}`
    this.#createDir(this.dir)
  }

  #createDir(dir) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir)
    }
  }

  #createTemplateDir(template) {
    const path = `${this.dir}/${template}`
    this.#createDir(path)
    return path
  }
  #appendToFile(filePath, content) {
    fs.writeFileSync(filePath, content, (err) => {
      if (err) {
        throw err
      }
    })
  }

  createFile(template, lang, content) {
    const templatePath = this.#createTemplateDir(template)

    const filePath = `${templatePath}/${lang}.html`
    this.#appendToFile(filePath, content)
  }

  #deleteDir() {
    fs.rmSync(this.dir, { recursive: true, force: true }, (err) => {
      if (err) {
        console.log('error occurred while deleting directory', err)
      }
    })
  }
  #deleteArchive() {
    const zipFilePath = `${FileManager.#OS_TEMP_DIR_PATH}/emails_templates.zip`
    try {
      fs.unlinkSync(zipFilePath)
      console.log(`${zipFilePath} was deleted successfully`)
    } catch (e) {
      console.log(e)
    }
  }

  async createZipArchive() {
    try {
      const zip = new AdmZip()

      const fileName = 'emails_templates'

      const outputFile = `${FileManager.#OS_TEMP_DIR_PATH}/${fileName}.zip`
      zip.addLocalFolder(this.dir)
      zip.writeZip(outputFile)

      const file = new File(fileName + '.zip', {
        type: 'application/zip',
      })

      return file
    } catch (e) {
      console.log(`Something went wrong. ${e}`)
    } finally {
      this.#deleteDir()
      this.#deleteArchive()
    }
    return null
  }

  // localFileData(path) {
  //   this.arrayBuffer = (() => {
  //     var buffer = fs.readFileSync(path)
  //     var arrayBuffer = buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength)
  //     return [arrayBuffer]
  //   })()
  // }

  // constructNewFile(localFileData) {
  //   return new File(localFileData.arrayBuffer, localFileData.name, { type: localFileData.type })
  // }

  // async createFile2(path, name) {
  //   let buffer = fs.readFileSync(path)
  //   // let response = await fetch(path)
  //   // let data = await response.blob()
  //   const parts = [
  //     new Blob([path], {
  //       type: 'application/zip',
  //     }),
  //     new Uint16Array([33]),
  //   ]
  //   let blob = new Blob([buffer])
  //   let metadata = {
  //     type: 'application/zip',
  //   }
  //   return new File(parts, name, metadata)
  // }
  // async compressFile(fileName, path) {
  //   var zip = new JSZip()
  //   let newFile
  //   //zip.file(file.name, file)
  //   zip.folder(path)

  //   await zip.generateAsync({ type: 'nodebuffer' }).then((blob) => {
  //     newFile = new File([blob], fileName + '.zip', {
  //       //lastModified: file.lastModified,
  //       type: 'application/zip',
  //     })
  //   })
  //   return newFile
  // }

  // [2 FUNCTIONS BELOW USEFUL FOR IMPORT EMAILS FEATURE AND TESTING]

  // async extractArchive(filepath) {
  //   try {
  //     const zip = new AdmZip(filepath)
  //     const outputDir = `${path.parse(filepath).name}_extracted`
  //     zip.extractAllTo(outputDir)

  //     console.log(`Extracted to "${outputDir}" successfully`)
  //   } catch (e) {
  //     console.log(`Something went wrong. ${e}`)
  //   }
  // }

  // async readFile() {
  //     const fileContent = await new Promise((resolve, reject) => {
  //         return fs.readFile(filePath, {encoding: 'utf8'}, (err, data) => {
  //             if (err) {
  //                 return reject(err)
  //             }
  //             return resolve(data)
  //         })
  //     })
  //
  //     //console.log(fileContent)
  //     return fileContent
  // }
}

export default FileManager
