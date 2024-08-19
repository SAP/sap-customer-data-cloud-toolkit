// CodeEditor.js
import React from 'react'
import { Controlled as CodeMirror } from 'react-codemirror2'

// You will need to import specific CodeMirror assets based on your mode and theme
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/monokai.css'
import 'codemirror/mode/javascript/javascript'

const Code = ({ value, onChange }) => {
  return (
    <CodeMirror
      value={value}
      options={{
        mode: 'javascript',
        theme: 'monokai',
        lineNumbers: true,
      }}
      onBeforeChange={(editor, data, value) => {
        onChange(value)
      }}
      onChange={(editor, data) => {
        console.log('editor', editor)
        console.log('data', data)
        console.log('value', value)
        // Additional change handler logic if needed
      }}
    />
  )
}

//   const mainApp = document.querySelector('main-app')

//   const shadowRoot = mainApp.shadowRoot
//   const screenSet = shadowRoot.querySelector('app-root')
//   const iframe = screenSet.querySelector('iframe.console-app-iframe')

//   const iframeDocument = iframe.contentDocument || iframe.contentWindow.document
//   if (!iframeDocument) {
//     console.log("iframe couldn't be found in DOM.")
//     return
//   }

//   const mainAppIframe = iframeDocument.querySelectorAll('#screenSet')
//   console.log('Original mainAppIframe:', mainAppIframe)
//   const playground = mainAppIframe[0].querySelectorAll('#playground')
//   console.log('Original playground:', playground)
//   const codeMirrorClass = playground[0].querySelector('.CodeMirror')
//   console.log('Original codeMirrorClass:', codeMirrorClass)
//   console.log('Original codeMirrorClass:', codeMirrorClass.CodeMirror)
// Attempt to find the CodeMirror instance attached to the element
//   let codeMirrorInstance = null

// Iterate over all properties of the element to find where CodeMirror instance is attached
//   for (let key in codeMirrorClass) {
//     if (key.startsWith('__') && codeMirrorClass[key] && typeof codeMirrorClass[key].getValue === 'function' && typeof codeMirrorClass[key].setValue === 'function') {
//       codeMirrorInstance = codeMirrorClass[key]
//       break
//     }
//   }

//   if (!codeMirrorInstance) {
//     console.error('CodeMirror instance not found.')
//     return
//   }

//   // New content to set in the CodeMirror editor
//   const newContent = `
// function example() {
//   let message = "Hello, World!";
//   console.log(message);
// }
// `

//   // Use CodeMirror's API to set the new content
//   codeMirrorInstance.setValue(newContent)

//   console.log('New content set in CodeMirror editor.')
//   const codeMirrorSizer = playground[0].querySelectorAll('.CodeMirror-sizer')
//   console.log('Original codeMirrorSizer:', codeMirrorSizer)
//   const code = codeMirrorSizer[0].querySelectorAll('.CodeMirror-code')
//   console.log('Original CODE:', code[0].textContent)
//   let codeMirrorInstance = code[0] && code[0].CodeMirror
//   console.log('Original codeMirrorInstance:', codeMirrorInstance)
//------------------------Works to manipulate without CodeMirror---------------------------------
//   if (code) {
//     let codeLines = code[0].querySelectorAll('.CodeMirror-line')
//     console.log('Original codeLines:', codeLines)

//     if (codeLines.length > 0) {
//       const newContent = `
//         function example() {
//           let message = "Hello, World!";
//           console.log(message);
//         }
//       `
//         .trim()
//         .split('\n')

//       // Clear current lines
//       codeLines.forEach((line) => (line.innerHTML = ''))
//       console.log('Original codeLines2:', codeLines)

//       // Add new content line-by-line
//       newContent.forEach((lineContent, index) => {
//         if (codeLines[index]) {
//           console.log('Original codeLines[index]:', codeLines[index].innerHTML)

//           codeLines[index].innerHTML = `<span role="presentation" style="padding-right: 0.1px;">${lineContent}</span>`
//         } else {
//           let newLine = document.createElement('pre')
//           newLine.classList.add('CodeMirror-line')
//           newLine.setAttribute('role', 'presentation')
//           newLine.innerHTML = `<span role="presentation" style="padding-right: 0.1px;">${lineContent}</span>`
//           code.appendChild(newLine)
//         }
//       })
//       console.log('Original newContent[index]:', newContent)

//       console.log('New content set in CodeMirror editor by direct manipulation.')
//     } else {
//       console.log('No .CodeMirror-line elements found.')
//     }
//   } else {
//     console.log('.CodeMirror element not found.')
//   }

// Accessing CodeMirror instance
//   const codeMirrorInstance = codeMirrorSizer[0].closest('.CodeMirror').CodeMirror

// Set new value

export default Code
