import { Linter } from 'eslint-linter-browserify'
class CodeLinter {
  codeLinter() {
    let code = `export default {
        // Called when an error occurs.
        onError: function(event) {
       a + b
        },
    };
    `
    const linter = new Linter()
    const config = {
      languageOptions: {
        ecmaVersion: 2019,
        sourceType: 'module',
      },
      rules: {
        'no-console': 'warn',
      },
    }
    const finalResult = linter.verify(code, config)
    console.log('finalResult', finalResult)
  }
}

export default CodeLinter
