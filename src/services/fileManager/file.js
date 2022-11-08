import os from 'os'
import fs from 'fs'
import AdmZip from 'adm-zip'
//import path from 'path'

class File {
  static #OS_TEMP_DIR_PATH = os.tmpdir()
  static #DIR = `${File.#OS_TEMP_DIR_PATH}/cdc-tools-chrome-extension`
  #createDir(dir) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir)
    }
  }

  #createTemplateDir(template) {
    const path = `${File.#DIR}/${template}`
    this.#createDir(path)
    return path
  }

  #appendToFile(filePath, content) {
    fs.writeFileSync(filePath, content, { flag: 'a+' }, (err) => {
      if (err) throw err
    })
  }

  createFile(template, lang, content) {
    this.#createDir(File.#DIR)

    const templatePath = this.#createTemplateDir(template)

    const filePath = `${templatePath}/${lang}.html`
    this.#appendToFile(filePath, content)
  }

  #deleteDir() {
    fs.rmdirSync(File.#DIR, { recursive: true, force: true }, (err) => {
      if (err) {
        return console.log('error occurred while deleting directory', err)
      }
      console.log(`${File.#DIR} directory deleted successfully`)
    })
  }

  async createZipArchive() {
    try {
      const zip = new AdmZip()
      const fileName = 'emails_templates'
      const outputFile = `${File.#OS_TEMP_DIR_PATH}/${fileName}.zip`
      zip.addLocalFolder(File.#DIR)
      zip.writeZip(outputFile)
      console.log(`Created ${outputFile} successfully`)
      this.#deleteDir()

      return outputFile
    } catch (e) {
      console.log(`Something went wrong. ${e}`)
    }
  }

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

export default File
