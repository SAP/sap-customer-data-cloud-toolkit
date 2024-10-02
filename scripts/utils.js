const fs = require('fs')

/**
 * getFileName uses a Regex to filter, match, and return the static file based on
 * the `prefix` and `extension` in the directory based on the `path`.
 *
 * @param {string} path File path relative to the build directory - `'static/js'`
 * @param {string} prefix File prefix for the file name - `'main'`
 * @param {string} extension File extension - 'js'
 * @returns {string} File name - `'main.66848e72.js'`
 */
function getFileName(path, prefix, extension) {
  const file = new RegExp(`^${prefix}\.[a-z0-9]+\.${extension}$`)
  return fs
    .readdirSync(`./build/${path}`)
    .filter((filename) => file.test(filename))
    .map((filename) => `${path}/${filename}`)[0]
}

module.exports = {
  getFileName,
}
