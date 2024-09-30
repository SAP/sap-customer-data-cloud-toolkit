import CodeMirror from 'codemirror'
import { Linter } from 'eslint-linter-browserify'

const defaultConfig = {
  ecmaFeatures: {},
  env: {
    browser: false,
    node: false,
    amd: false,
    mocha: false,
    jasmine: false,
  },
  rules: { 'no-console': 'warn' },
}
function codeLinter() {
  let code = `export default {
        // Called when an error occurs.
        onError: function(event) {
       a + b
        },
    };
    `
  let result = []
  const linter = new Linter()
  let config = defaultConfig
  console.log('config', config)

  var errors = linter.verify(code, config)
  console.log('errors', errors)
  for (let i = 0; i < errors.length; i++) {
    var error = errors[i]
    console.log('errorArray', error)
    result.push({ message: error.message, severity: getSeverity(error), from: getPos(error, true), to: getPos(error, false) })
    console.log('resultArray', result)
  }
  return result
  // const config = {
  //   languageOptions: {
  //     ecmaVersion: 2019,
  //     sourceType: 'module',
  //   },
  //   rules: {
  //     'no-console': 'warn',
  //   },
  // }
  // const finalResult = linter.verify(code, config)
}
CodeMirror.registerHelper('lint', 'javascript', codeLinter)

function getSeverity(error) {
  console.log('errorSeverity', error)
  switch (error.severity) {
    case 1:
      return 'warning'
    case 2:
      return 'error'
    default:
      return 'error'
  }
}
function getPos(error, from) {
  console.log('errorgetPos', error)
  console.log('fromgetPos', from)

  var line = error.line - 1,
    ch = from ? error.column : error.column + 1
  if (error.node && error.node.loc) {
    line = from ? error.node.loc.start.line - 1 : error.node.loc.end.line - 1
    ch = from ? error.node.loc.start.column : error.node.loc.end.column
  }
  return CodeMirror.Pos(line, ch)
}
