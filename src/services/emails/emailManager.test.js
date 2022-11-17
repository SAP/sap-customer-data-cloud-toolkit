import axios from 'axios'
import * as EmailsTestData from './data_test'
import EmailManager from './emailManager'
import AdmZip from 'adm-zip'
// import os from 'os'
// import fs from 'fs'
//import pkg from '../../../package.json'
// import { readdir } from 'node:fs/promises'
// import { join } from 'node:path'

jest.mock('axios')
jest.setTimeout(30000)

describe('Emails Manager test suite', () => {
  const emailManager = new EmailManager(EmailsTestData.credentials)

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('1 - export', async () => {
    const mockedResponse = { data: EmailsTestData.getEmailsExpectedResponse }
    axios.mockResolvedValueOnce(mockedResponse).mockResolvedValueOnce(mockedResponse)
    const expectedZipEntries = [
      'impexMetadata.json',
      'MagicLink/en.html',
      'MagicLink/pt.html',
      'CodeVerification/en.html',
      'EmailVerification/en.html',
      'NewUserWelcome/ar.html',
      'AccountDeletionConfirmation/pt-br.html',
      'PasswordResetConfirmation/pt-br.html',
      'LitePreferencesCenter/en.html',
      'DoubleOptInConfirmation/ar.html',
      'PasswordReset/en.html',
      'TFAEmailVerification/en.html',
      'ImpossibleTraveler/en.html',
    ]

    const zipContent = await emailManager.export('apiKey')

    const zip = new AdmZip(zipContent, null)

    // const dir = '/var/folders/3b/gnvgvfy91yzc2_4r25ks1c8c0000gn/T/cdc-tools-chrome-extension/'
    // if (!fs.existsSync(dir)) {
    //   fs.mkdirSync(dir)
    // }
    // await extractArchive(dir, zip)
    // let files = (await deepReadDir(dir)).flat(Number.POSITIVE_INFINITY)
    // files = files.map(function (v) {
    //   return v.slice(dir.length)
    // })
    // console.log(files)
    // expect(files.sort()).toEqual(expectedZipEntries.sort())
    // fs.rmSync(dir, { recursive: true })

    // var zipEntries = zip.getEntries() // an array of ZipEntry records
    // console.log('number of entries' + zipEntries.length)
    // zipEntries.forEach(function (zipEntry) {
    //   console.log(zipEntry.toString()) // outputs zip entries information
    // })
    // console.log('end of entries')

    // console.log('getzipEntries:' + getZipEntries(zip).sort())
    // console.log('expectedZipEntries:' + expectedZipEntries.sort())

    expect(getZipEntries(zip).sort()).toEqual(expectedZipEntries.sort())
    //verifyWorkDirIsDeleted()
    //console.log(`Directory ${os.tmpdir()}/${pkg.name} exists? ${fs.existsSync(`${os.tmpdir()}/${pkg.name}`)}`)
  })

  // test('2 - export with minimum templates', async () => {
  //   const mockedResponse = { data: EmailsTestData.getEmailsExpectedResponseWithMinimumTemplates() }
  //   //axios.mockResolvedValue(mockedResponse)
  //   axios.mockResolvedValueOnce(mockedResponse).mockResolvedValueOnce(mockedResponse)
  //   const expectedZipEntries = [
  //     'impexMetadata.json',
  //     'MagicLink/en.html',
  //     'MagicLink/pt.html',
  //     'CodeVerification/en.html',
  //     'NewUserWelcome/ar.html',
  //     'LitePreferencesCenter/en.html',
  //     'DoubleOptInConfirmation/ar.html',
  //     'PasswordReset/en.html',
  //     'TFAEmailVerification/en.html',
  //   ]

  //   const zipContent = await emailManager.export('apiKey')

  //   const zip = new AdmZip(zipContent, null)
  //   console.log('getzipEntries:' + getZipEntries(zip).sort())
  //   console.log('expectedZipEntries:' + expectedZipEntries.sort())
  //   expect(getZipEntries(zip).sort()).toEqual(expectedZipEntries.sort())
  //   verifyWorkDirIsDeleted()
  //   console.log(`Directory ${os.tmpdir()}/${pkg.name} exists? ${fs.existsSync(`${os.tmpdir()}/${pkg.name}`)}`)
  // })

  // test('3 - export templates', async () => {
  //   const mockedResponse = { data: EmailsTestData.getEmailsExpectedResponse }
  //   axios.mockResolvedValue(mockedResponse)

  //   const emailTemplates = await emailManager.exportTemplates('apiKey')
  //   //console.log(`test.response=${JSON.stringify(emailTemplates)}`)
  //   expect(emailTemplates).toEqual(EmailsTestData.expectedExportConfigurationFileContent)
  // })

  // test('4 - export templates with minimum templates', async () => {
  //   const mockedResponse = { data: EmailsTestData.getEmailsExpectedResponseWithMinimumTemplates() }
  //   axios.mockResolvedValue(mockedResponse)

  //   const emailTemplates = await emailManager.exportTemplates('apiKey')
  //   //console.log(`test.response=${JSON.stringify(emailTemplates)}`)
  //   expect(emailTemplates).toEqual(EmailsTestData.getExpectedExportConfigurationFileContentWithMinimumTemplates())
  // })
})

function getZipEntries(zip) {
  const entries = []
  for (const zipEntry of zip.getEntries()) {
    if (!zipEntry.isDirectory) {
      entries.push(`${zipEntry.entryName}`)
    }
  }
  console.log('entries:' + entries)
  return entries
}

function verifyWorkDirIsDeleted() {
  console.log(`Checking dir ${os.tmpdir()}/${pkg.name} is deleted`)
  expect(fs.existsSync(`${os.tmpdir()}/${pkg.name}`)).toBe(false)
}

async function extractArchive(outputDir, zip) {
  try {
    // const zip = new AdmZip(filepath)
    // const outputDir = `${path.parse(filepath).name}_extracted`
    zip.extractAllTo(outputDir)

    console.log(`Extracted to "${outputDir}" successfully`)
  } catch (e) {
    console.log(`Something went wrong. ${e}`)
  }
}

async function listDir(path) {
  return await fs.promises.readdir(path)
}

const deepReadDir = async (dirPath) =>
  await Promise.all(
    (
      await readdir(dirPath, { withFileTypes: true })
    ).map(async (dirent) => {
      const path = join(dirPath, dirent.name)
      return dirent.isDirectory() ? await deepReadDir(path) : path
    })
  )
