import File from '../fileManager/file'
import os from 'os'
import * as EmailsTestData from '../emails/data_test'
import fs from 'fs'
jest.mock('axios')
jest.setTimeout(10000)

describe('files test suite', () => {
  const OS_TEMP_DIR_PATH = os.tmpdir()
  const DIR = `${OS_TEMP_DIR_PATH}/cdc-tools-chrome-extension`
  test('create file in temp dir', async () => {
    const file = new File()
    file.createFile('emailVerification', 'es', EmailsTestData.emailTemplate)

    expect(fs.existsSync(DIR)).toBe(true)
  })

  test('check if 1 folder has 1 html file', async () => {
    const file = new File()
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
    const file = new File()
    file.createFile('emailVerification', 'es', EmailsTestData.emailTemplate)
    const archiveFileName = await file.createZipArchive()

    expect(fs.existsSync(archiveFileName)).toBe(true)
  })

  test('check if folder is deleted after archive creation', async () => {
    const file = new File()
    file.createFile('emailVerification', 'es', EmailsTestData.emailTemplate)
    const archiveFileName = await file.createZipArchive()

    expect(fs.existsSync(archiveFileName)).toBe(true)
    expect(fs.existsSync(DIR)).toBe(false)
  })
})

function createTemplates(templates, langs) {
  const file = new File()
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
