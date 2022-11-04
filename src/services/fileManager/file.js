import os from 'os'
import fs from 'fs'
import AdmZip from 'adm-zip'

class File {
  static #OS_TEMP_DIR_PATH = os.tmpdir()
  static #DIR = File.#OS_TEMP_DIR_PATH + '/' + 'cdc-tools-chrome-extension'

  createDir(dir) {
    console.log(dir)
    if (!fs.existsSync(dir)) {
      console.log('-------')
      fs.mkdirSync(dir)
    }
  }

  createTemplateDir(template) {
    const path = File.#DIR + '/' + template
    this.createDir(path)
    return path
  }

  appendToFile(filePath, content) {
    fs.writeFileSync(filePath, content, { flag: 'a+' }, (err) => {
      if (err) throw err
    })
  }

  createFile(template, lang, content) {
    this.createDir(File.#DIR)

    const templatePath = this.createTemplateDir(template)

    const filePath = templatePath + '/' + lang + '.html'

    this.appendToFile(filePath, content)
  }

  async createZipArchive() {
    try {
      const zip = new AdmZip()
      const outputFile = 'emailsTemplates.zip'
      zip.addLocalFolder(File.#DIR)
      zip.writeZip(outputFile)
      console.log(`Created ${outputFile} successfully`)
    } catch (e) {
      console.log(`Something went wrong. ${e}`)
    }
  }

  async extractArchive(filepath) {
    try {
      const zip = new AdmZip(filepath)
      const outputDir = `${path.parse(filepath).name}_extracted`
      zip.extractAllTo(outputDir)

      console.log(`Extracted to "${outputDir}" successfully`)
    } catch (e) {
      console.log(`Something went wrong. ${e}`)
    }
  }

  // [USEFUL FOR TESTING]

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
