import os from 'os'
import fs from 'fs'
import AdmZip from 'adm-zip'
class FileManager {
  static #OS_TEMP_DIR_PATH = os.tmpdir()
  #dir
  constructor(dir) {
    this.#dir = `${FileManager.#OS_TEMP_DIR_PATH}/${dir}`
    this.#createDir(this.#dir)
  }

  #createDir(dir) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir)
    }
  }

  #createTemplateDir(template) {
    const path = `${this.#dir}/${template}`
    this.#createDir(path)
    return path
  }

  #writeToFile(filePath, content) {
    fs.writeFileSync(filePath, content)
  }

  createFile(template, name, content) {
    const templatePath = this.#createTemplateDir(template)
    const filePath = `${templatePath}/${name}.html`
    this.#writeToFile(filePath, content)
    return `${template}/${name}.html`
  }

  create(name, content) {
    this.#writeToFile(`${this.#dir}/${name}`, content)
  }

  deleteWorkDir() {
    fs.rmSync(this.#dir, { recursive: true, force: true })
  }

  async createZipArchive(fileName) {
    const zip = new AdmZip()
    const outputFile = `${this.#dir}/${fileName}.zip`
    zip.addLocalFolder(this.#dir)
    zip.writeZip(outputFile)
    return zip.toBuffer()
  }

  /*
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
  */
}

export default FileManager
