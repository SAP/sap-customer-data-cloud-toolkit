import ZipManager from './zipManager'
//import AdmZip from 'adm-zip'
import JSZip from 'jszip'

describe('files test suite', () => {
  test('create file in temp dir', async () => {
    const expectedZipEntries = ['template/name.html']

    const zipManager = new ZipManager()
    const path = zipManager.createFile('template', 'name', 'content')
    expect(path).toBe('template/name.html')

    //const zip = new AdmZip(zipManager.createZipArchive())
    //expect(getZipEntries(zip)).toEqual(expectedZipEntries)

    const new_zip = new JSZip()
    // new_zip.loadAsync(zipManager.createZipArchive()).then(function (zip) {
    //   // you now have every files contained in the loaded zip
    //   //let f = zip.file('template/name.html').async('string') // a promise of "Hello World\n"

    //     zip.forEach(function (relativePath, zipEntry) {
    //     console.log(zipEntry.name)
    //   })
    // })

    // const p = await new_zip.loadAsync(zipManager.createZipArchive()).then(function (zip) {
    //   Object.keys(zip.files).forEach(function (filename) {
    //     zip.files[filename].async('string').then(function (fileData) {
    //       console.log(fileData) // These are your file contents
    //     })
    //   })
    // })
    const d = await new_zip.loadAsync(zipManager.createZipArchive()).then(function (contents) {
      Object.keys(contents.files).forEach(function (filename) {
        return new_zip.files[filename].async('nodebuffer').then(function (content) {
          var dest = path + filename
          console.log('dest=' + filename)
          console.log('content=' + content)
          return dest
        })
      })
    })

    console.log('fim do test' + d)
  })
})

// function getZipEntries(zip) {
//   const entries = []
//   for (const zipEntry of zip.getEntries()) {
//     if (!zipEntry.isDirectory) {
//       entries.push(`${zipEntry.entryName}`)
//     }
//   }
//   console.log('entries:' + entries)
//   return entries
// }
