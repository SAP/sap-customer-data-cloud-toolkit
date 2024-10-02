/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */

const fs = require('fs')

const { getFileName } = require('./utils')

/**
 * Replaces a placeholder in a file with a specified value.
 *
 * @param {string} path File path relative to the build directory - `'static/js'`
 * @param {string} prefix File prefix for the file name - `'main'`
 * @param {string} extension File extension - 'js.map'
 * @param {string} placeholder Placeholder string to be replaced - `'{{REPLACED_IN_RELEASE}}'`
 * @param {string|boolean} replacement Value to replace the placeholder with - `false`
 */
function replacePlaceholderInFile(path, prefix, extension, placeholder, replacement) {
  const filePath = getFileName(path, prefix, extension)
  const fileContent = fs.readFileSync(`build/${filePath}`, 'utf8')
  const newFileContent = fileContent.replace(placeholder, replacement)
  fs.writeFileSync(`build/${filePath}`, newFileContent)
}

// Example usage
replacePlaceholderInFile('static/js', 'main', 'js.map', "'{{REPLACED_IN_RELEASE}}'", false)
