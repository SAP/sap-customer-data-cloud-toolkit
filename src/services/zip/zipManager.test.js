/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */


import ZipManager from './zipManager'

describe('files test suite', () => {
  test('create', async () => {
    const expectedZipEntries = new Map()
    expectedZipEntries.set('template/name.html', 'content')
    expectedZipEntries.set('template/name2.html', 'content2')
    expectedZipEntries.set('template2/name3.html', 'content3')
    expectedZipEntries.set('name4', 'content4')

    const zipManager = new ZipManager()
    const path = zipManager.createFile('template', 'name.html', 'content')
    expect(path).toBe('template/name.html')
    zipManager.createFile('template', 'name2.html', 'content2')
    zipManager.createFile('template2', 'name3.html', 'content3')
    zipManager.create('name4', 'content4')

    const filesContent = await zipManager.read(zipManager.createZipArchive())
    expect(filesContent).toEqual(expectedZipEntries)
  })

  test('strange characters', async () => {
    const expectedZipEntries = new Map()
    expectedZipEntries.set('.../?.html', 'content')
    expectedZipEntries.set('.../*.html', 'content2')
    expectedZipEntries.set('?/|.html', 'content3')
    expectedZipEntries.set('#', 'content4')

    const zipManager = new ZipManager()
    const path = zipManager.createFile('...', '?.html', 'content')
    expect(path).toBe('.../?.html')
    zipManager.createFile('...', '*.html', 'content2')
    zipManager.createFile('?', '|.html', 'content3')
    zipManager.create('#', 'content4')

    const filesContent = await zipManager.read(zipManager.createZipArchive())
    expect(filesContent).toEqual(expectedZipEntries)
  })
})
