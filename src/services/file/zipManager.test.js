import ZipManager from './zipManager'

describe('files test suite', () => {
  const expectedZipEntries = new Map()

  beforeEach(() => {
    expectedZipEntries.set('template/name.html', 'content')
    expectedZipEntries.set('template/name2.html', 'content2')
    expectedZipEntries.set('template2/name3.html', 'content3')
    expectedZipEntries.set('name4', 'content4')
  })

  test('create', async () => {
    const zipManager = new ZipManager()
    const path = zipManager.createFile('template', 'name', 'content')
    expect(path).toBe('template/name.html')
    zipManager.createFile('template', 'name2', 'content2')
    zipManager.createFile('template2', 'name3', 'content3')
    zipManager.create('name4', 'content4')

    const filesContent = await zipManager.read(zipManager.createZipArchive())
    expect(filesContent).toEqual(expectedZipEntries)
  })

  test('clear', async () => {
    let zipManager = new ZipManager()
    const filesContent = await zipManager.read(zipManager.createZipArchive())
    expect(filesContent).toEqual(expectedZipEntries)

    zipManager.clear()
    zipManager = new ZipManager()
    expect(await zipManager.read(zipManager.createZipArchive())).toEqual(new Map())
  })
})
