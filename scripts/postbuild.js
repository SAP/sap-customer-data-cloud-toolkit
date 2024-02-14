/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */

const fs = require('fs')
const manifest = require('../public/manifest.json')

/**
 * readFile uses a Regex to filter, match, and return the static file based on
 * the `prefix` and `extension` in the directory based on the `path`.
 *
 * @param {string} path File path relative to the build directory - `'static/js'`
 * @param {string} prefix File prefix for the file name - `'main'`
 * @param {string} extension File extension - 'js'
 * @returns {string} File name - `'main.66848e72.js'`
 */
function readFile(path, prefix, extension) {
  const file = new RegExp(`^${prefix}\.[a-z0-9]+\.${extension}$`)
  return fs
    .readdirSync(`./build/${path}`)
    .filter((filename) => file.test(filename))
    .map((filename) => `${path}/${filename}`)[0]
}

function updateManifestFiles(manifest, jsFile, cssFile) {
  manifest.content_scripts.forEach((script) => {
    script.js.push(jsFile)
    script.css.push(cssFile)
  })

  manifest['web_accessible_resources'].forEach((resource) => {
    resource.resources.push(cssFile)
  })
}

const js = readFile('static/js', 'main', 'js')
const css = readFile('static/css', 'main', 'css')

const newManifest = {
  ...manifest,
}

updateManifestFiles(newManifest, js, css)
fs.writeFileSync('./build/manifest.json', JSON.stringify(newManifest, null, 2))
