/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */
/*eslint no-implied-eval: "error"*/
import { withTranslation } from 'react-i18next'

import React from 'react'

// import Code from '../../codeMirror'
import { Bar, Button } from '@ui5/webcomponents-react'
import { createUseStyles } from 'react-jss'
import styles from './email-templates.styles.js'
import CodeLinter from '../../services/linter/eslint.js'
const CodeMirrorEditor = () => {
  const linter = new CodeLinter()
  console.log('linter', linter.codeLinter())
  // Locate the existing CodeMirror instance
  // const existingCodeMirrorElement = document.querySelector('.CodeMirror.cm-s-default.CodeMirror-wrap')
}

// Function to update the CodeMirror value
// const updateValue = (newValue) => {
//   if (codeMirrorRef.current) {
//     codeMirrorRef.current.setValue('TEXT')
//   }
// }

// return (
//   <div>
//     <h1>Edit Existing CodeMirror Instance</h1>
//     <p>Current Value:</p>
//     <textarea value={'value'} onChange={(e) => updateValue(e.target.value)} rows={10} cols={50} />
//   </div>
// )

// function getCodeMirrorValue() {
//   const instances = manipulateCodeMirror()
//   console.log('instances', instances)
//   if (instances.length > 0) {
//     console.log('instances[index].getValue()', instances.getValue())
//     return { value: instances.getValue() }
//   } else {
//     return { error: 'Instance not found' }
//   }
// }
// Function to handle the button click
// const handleButtonClick = () => {
//   const mainApp = document.querySelector('main-app')
//   const shadowRoot = mainApp?.shadowRoot
//   const screenSet = shadowRoot?.querySelector('app-root')
//   const iframe = screenSet?.querySelector('iframe.console-app-iframe')

//   const iframeDocument = iframe?.contentDocument || iframe?.contentWindow.document
//   const mainAppIframe = iframeDocument?.querySelectorAll('#screenSet')
//   console.log('Original mainAppIframe:', mainAppIframe)
//   const playground = mainAppIframe?.[0]?.querySelectorAll('#playground')
//   console.log('Original playground:', playground)
//   const codeMirrorClass = playground?.[0]?.querySelector('.CodeMirror')

//   if (codeMirrorClass) {
//     console.log('Original codeMirrorScroll:', playground[0])
//     manipulateCodeMirror(playground[0])
//   } else {
//     console.error('Could not find the CodeMirror div.')
//   }
// }
const ESLINT = () => {
  const useStyles = createUseStyles(styles, { name: 'EmailTemplates' })
  const classes = useStyles()

  return (
    <>
      <Bar
        className={classes.outerBarStyle}
        endContent={
          <Button id="importAllEmailTemplatesButton" data-cy="importAllEmailTemplatesButton" className={classes.importAllButtonStyle} onClick={CodeMirrorEditor}>
            Edit Code
          </Button>
        }
      ></Bar>
    </>
  )
}

export default withTranslation()(ESLINT)
