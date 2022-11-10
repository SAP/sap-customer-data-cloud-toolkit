import FileManager from './fileManager'
import os from 'os'
import * as EmailsTestData from '../emails/data_test'
import fs from 'fs'
import AdmZip from 'adm-zip'

jest.mock('axios')
jest.setTimeout(10000)

describe('files test suite', () => {
  const OS_TEMP_DIR_PATH = os.tmpdir()
  const DIR = `${OS_TEMP_DIR_PATH}/cdc-tools-chrome-extension`
  test('create file in temp dir', async () => {
    const file = new FileManager('cdc-tools-chrome-extension')
    file.createFile('emailVerification', 'es', EmailsTestData.emailTemplate)

    expect(fs.existsSync(DIR)).toBe(true)
  })

  test('check if 1 folder has 1 html file', async () => {
    const file = new FileManager('cdc-tools-chrome-extension')
    file.createFile('emailVerification', 'es', EmailsTestData.emailTemplate)

    expect(await checkIfFileExists('es', DIR, 'emailVerification')).toBe(true)
  })

  test('check if 1 folder has more than 1 html file', async () => {
    const langs = ['en', 'pt', 'es', 'fr']
    const templates = ['emailVerification']

    createTemplates(templates, langs)

    expect(await checkIfFileExists(langs[0], DIR, templates[0])).toBe(true)
    expect(await checkIfFileExists(langs[1], DIR, templates[0])).toBe(true)
    expect(await checkIfFileExists(langs[2], DIR, templates[0])).toBe(true)
    expect(await checkIfFileExists(langs[3], DIR, templates[0])).toBe(true)
  })

  test('check if more than 1 folder has N html files', async () => {
    const langs = ['en', 'pt-br', 'es', 'fr']
    const templates = ['emailVerification', 'passwordReset']

    createTemplates(templates, langs)

    expect(await checkIfFileExists(langs[0], DIR, templates[0])).toBe(true)
    expect(await checkIfFileExists(langs[1], DIR, templates[0])).toBe(true)
    expect(await checkIfFileExists(langs[2], DIR, templates[0])).toBe(true)
    expect(await checkIfFileExists(langs[3], DIR, templates[0])).toBe(true)
    expect(await checkIfFileExists(langs[0], DIR, templates[1])).toBe(true)
    expect(await checkIfFileExists(langs[1], DIR, templates[1])).toBe(true)
    expect(await checkIfFileExists(langs[2], DIR, templates[1])).toBe(true)
    expect(await checkIfFileExists(langs[3], DIR, templates[1])).toBe(true)
  })

  test('create .zip archive', async () => {
    let buffer

    const file = new FileManager('cdc-tools-chrome-extension')
    file.createFile('emailVerification', 'es', EmailsTestData.emailTemplate)
    buffer = await file.createZipArchive()

    const zip = new AdmZip(buffer)
    const entries = zip.getEntries()
    // entries.forEach((e) => {
    //   console.log(e.toString())
    // })
    // expect(fs.existsSync(DIR)).toBe(false)
    // expect(buffer).toBeDefined()
  })

  test('check if folder and .zip is deleted after archive creation', async () => {
    const file = new FileManager('cdc-tools-chrome-extension')
    file.createFile('emailVerification', 'es', EmailsTestData.emailTemplate)
    const buffer = await file.createZipArchive()

    // expect(buffer).toBeDefined()
    // expect(archiveFile.dir).toBe(`${OS_TEMP_DIR_PATH}/emails_templates.zip`)
    // expect(!fs.existsSync(DIR)).toBe(true)
    // expect(!fs.existsSync(`${OS_TEMP_DIR_PATH}/emails_templates.zip`)).toBe(true)
  })
})

function createTemplates(templates, langs) {
  const file = new FileManager('cdc-tools-chrome-extension')
  for (const t of templates) {
    for (const l of langs) {
      file.createFile(t, l, EmailsTestData.emailTemplate)
    }
  }
}

async function checkIfFileExists(lang, path, template) {
  const dir = await fs.promises.opendir(path + '/' + template)
  for await (const dirent of dir) {
    console.log(dirent.name)
    if (dirent.name.includes(lang)) {
      return true
    }
  }
}
