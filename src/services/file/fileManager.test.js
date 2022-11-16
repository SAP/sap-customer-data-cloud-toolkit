import FileManager from './fileManager'
import os from 'os'
import * as EmailsTestData from '../emails/data_test'
import fs from 'fs'

jest.mock('axios')
jest.setTimeout(50000)

describe('files test suite', () => {
  const OS_TEMP_DIR_PATH = os.tmpdir()
  const DIR = `${OS_TEMP_DIR_PATH}/cdc-tools-chrome-extension`
  const archiveName = 'emails_templates'

  const file = new FileManager('cdc-tools-chrome-extension')
  test('create file in temp dir', async () => {
    file.createFile('emailVerification', 'es', EmailsTestData.emailTemplate)

    expect(fs.existsSync(DIR)).toBe(true)
  })

  test('create config file in temp dir', async () => {
    const fileName = 'config.json'
    const jsonContent = `{
    "callId": "32c8324a202449b28039c93655db4efb",
    "errorCode": 0,
    "apiVersion": 2,
    "statusCode": 200,
    "statusReason": "OK",
    "time": "",
    "magicLink": {
        "defaultLanguage": "en",
        "urlPlaceHolder": "$url",
    }`
    file.create(fileName, jsonContent)

    expect(fs.existsSync(`${DIR}/${fileName}`)).toBe(true)
  })

  test('create config file error', async () => {
    const fileName = 'config......'
    const content = ''
    const errorMsg = 'The "data" argument must be of type string or an instance of Buffer, TypedArray, or DataView. Received function toString'

    expect(() => {
      file.create(fileName, content.toString)
    }).toThrow(errorMsg)
    expect(fs.existsSync(`${DIR}/${fileName}`)).toBe(false)
  })

  test('check if 1 folder has 1 html file', async () => {
    file.createFile('emailVerification', 'es', EmailsTestData.emailTemplate)

    expect(await checkIfFileExists('es', DIR, 'emailVerification')).toBe(true)
  })

  test('check if 1 folder has more than 1 html file', async () => {
    const langs = ['en', 'pt', 'es', 'fr']
    const templates = ['emailVerification']

    createTemplates(file, templates, langs)

    expect(await checkIfFileExists(langs[0], DIR, templates[0])).toBe(true)
    expect(await checkIfFileExists(langs[1], DIR, templates[0])).toBe(true)
    expect(await checkIfFileExists(langs[2], DIR, templates[0])).toBe(true)
    expect(await checkIfFileExists(langs[3], DIR, templates[0])).toBe(true)
  })

  test('check if more than 1 folder has N html files', async () => {
    const langs = ['en', 'pt-br', 'es', 'fr']
    const templates = ['emailVerification', 'passwordReset']

    createTemplates(file, templates, langs)

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
    file.createFile('emailVerification', 'es', EmailsTestData.emailTemplate)
    buffer = await file.createZipArchive(archiveName)

    expect(buffer).toBeDefined()
  })

  test('create .zip archive error', async () => {
    file.createFile('emailVerification', 'es', EmailsTestData.emailTemplate)
    await expect(file.createZipArchive('\0')).rejects.toThrow()
  })

  test('check if folder and .zip is deleted after archive creation', async () => {
    file.createFile('emailVerification', 'es', EmailsTestData.emailTemplate)
    const buffer = await file.createZipArchive(archiveName)

    expect(buffer).toBeDefined()
    file.deleteWorkDir()
    expect(fs.existsSync(DIR)).toBe(false)
  })
})

function createTemplates(file, templates, langs) {
  for (const t of templates) {
    for (const l of langs) {
      file.createFile(t, l, EmailsTestData.emailTemplate)
    }
  }
}

async function checkIfFileExists(lang, path, template) {
  const dir = await fs.promises.opendir(path + '/' + template)
  for await (const dirent of dir) {
    if (dirent.name.includes(lang)) {
      return true
    }
  }
}
