import CodeMirror from 'codemirror'
import { Linter } from 'eslint-linter-browserify'

// import globals from 'globals'
export const extractCode = () => {
  let mainApp = document.querySelector('main-app')

  let shadowRoot = mainApp.shadowRoot
  let screenSet = shadowRoot.querySelector('app-root')
  let iframe = screenSet.querySelector('iframe.console-app-iframe')

  let iframeDocument = iframe.contentDocument || iframe.contentWindow.document
  if (!iframeDocument) {
    console.log("iframe couldn't be found in DOM.")
  }
  let mainAppIframe = iframeDocument.querySelectorAll('#screenSet')
  let playground = mainAppIframe[0].querySelectorAll('#playground')
  let codeMirror = playground[0].querySelectorAll('.CodeMirror-sizer')
  let code = codeMirror[0].querySelectorAll('.CodeMirror-code')
  console.log('CODE PARENT', code[0].textContent)
  const cleanedText = code[0].textContent
    .replace(/\d+/g, '') // Remove all digits
    .replace(/​/g, '') // Remove any stray characters
    .replace(/\s{2,}/g, ' ') // Replace multiple spaces with a single space
    .replace(/{ /g, '{\n    ') // Format opening brace
    .replace(/, /g, ',\n\n    ') // Format commas
    .replace(/} /g, '}\n\n') // Format closing braces
    .trim() // Trim any leading or trailing whitespace

  console.log('cleanedText', cleanedText)

  let preElements = code[0].querySelectorAll('pre.CodeMirror-line')
  let codeLines = []
  preElements.forEach((pre) => {
    let lineText = pre.textContent || pre.innerText || ''
    codeLines.push(lineText)
  })
  let combinedCode = codeLines.join('\n')
  console.log('Combined Code:', combinedCode)
  return combinedCode
}
export const reloadIframe = () => {
  // let mainApp = document.querySelector('main-app')
  // let shadowRoot = mainApp.shadowRoot
  // let screenSet = shadowRoot.querySelector('app-root')
  // let iframe = screenSet.querySelector('iframe.console-app-iframe')
  // if (iframe) {
  //   const originalSrc = iframe.src
  //   iframe.src = ''
  //   iframe.src = originalSrc
  //   iframe.addEventListener('load', function () {
  //     try {
  //       let iframeDocument = iframe.contentDocument || iframe.contentWindow.document
  //       iframeDocument.querySelector('html')
  //       // Manipulate the iframe document here
  //       // Example: Change background color of the iframe's body

  //       // Log the iframe document's content
  //       console.log('iframe.console-app-iframe', iframeDocument.querySelector('html'))
  //     } catch (error) {
  //       console.error('Cannot access iframe content due to Cross-Origin restrictions.', error)
  //     }
  //   })
  // }

  // Add listeners
  // iframe.addEventListener('load', () => {
  //   console.log('Iframe loaded successfully.')
  // })

  // iframe.addEventListener('error', (e) => {
  //   console.error('Iframe load error:', e)
  // })

  // // Temporarily unset the src
  // iframe.src = 'data:text/html,loading...'

  // Reapply the src after a delay
  // setTimeout(() => {
  //   iframe.src = `https://console.gigya.com/#/screen-sets-app/web/uiBuilder?screenSetId=Default-LinkAccounts&apiKey=3_BvA3VlTvrwSX1WhYFItrqeg1_mIU796DfEaXSRI4U3CeoUhQeQ_K0N9Zswq5nFeW&screenId=gigya-link-account-screen`
  //   console.log('Re-applied src with cache buster:', iframe.src)
  // }, 2000)
  let mainApp = document.querySelector('main-app')

  let shadowRoot = mainApp.shadowRoot
  let screenSet = shadowRoot.querySelector('app-root')
  let iframe = screenSet.querySelector('iframe.console-app-iframe').contentDocument.location.reload(true)
  if (iframe) {
    iframe = iframe.src
  }
}

export const MyComponent = () => {
  // let code = `export default {
  //     // Called when an error occurs.
  //     onError: function(event) {
  //     console.log(a+b)
  //     },
  // };
  // `
  // codeSt = code
  // const codeString = String(codeSt)
  // const config = {
  //   rules: { 'no-undef': 'warn', 'no-unused-vars': 'warn' },
  // }
  // const finalResult = linter.verify(codeSt, config)
  // console.log('finaleResult', finalResult)
  // return finalResult
  let mainApp = document.querySelector('main-app')

  let shadowRoot = mainApp.shadowRoot
  let screenSet = shadowRoot.querySelector('app-root')
  let iframe = screenSet.querySelector('iframe.console-app-iframe')

  let iframeDocument = iframe.contentDocument || iframe.contentWindow.document
  if (!iframeDocument) {
    console.log("iframe couldn't be found in DOM.")
  }
  let mainAppIframe = iframeDocument.querySelectorAll('#screenSet')
  let playground = mainAppIframe[0].querySelectorAll('#playground')
  let codeMirror = playground[0].querySelectorAll('.CodeMirror-sizer')
  let code = codeMirror[0].querySelectorAll('.CodeMirror-code')

  let preElements = code[0].querySelectorAll('pre.CodeMirror-line')
  let codeLines = []
  preElements.forEach((pre) => {
    let lineText = pre.textContent || pre.innerText || ''
    codeLines.push(lineText)
  })
  let combinedCode = codeLines.join('\n')
  console.log('Combined Code:', combinedCode)
}
export const trial = () => {
  let code = `export default {
    // Called when an error occurs.
    onError: function(event) {
   a + b
    },
};
`
  return code
}
export const compileResults = () => {
  console.log(typeof linterCode)
  const finishedResult = JSON.stringify(linterCode)
  console.log(finishedResult)
  return finishedResult
}
export function linterCode(defaultCode) {
  let code = `export default {
        // Called when an error occurs.
        onError: function(event) {
       a + b
        },
    };
    `

  const linter = new Linter()
  const codeString = code || defaultCode
  const config = {
    languageOptions: {
      ecmaVersion: 2019,
      sourceType: 'module',
    },
    rules: {
      'no-undef': 'warn',
      'no-console': 'warn',
    },
  }
  const finalResult = linter.verify(codeString, config)
  const mappedResults = finalResult.map((result) => ({
    message: result.message,
    severity: result.severity === 1 ? 'warning' : 'error',
    from: CodeMirror.Pos(result.line - 1, result.column - 1),
    to: CodeMirror.Pos(result.endLine ? result.endLine - 1 : result.line - 1, result.endColumn ? result.endColumn - 1 : result.column),
  }))

  return JSON.stringify(mappedResults)
}
