/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */
/*eslint no-implied-eval: "error"*/
import { withTranslation } from 'react-i18next'

import React from 'react'

import { Bar, Button } from '@ui5/webcomponents-react'
import { createUseStyles } from 'react-jss'
import styles from './email-templates.styles.js'
import '../../services/linter/eslint.js'
import CodeMirror from 'codemirror'
const CodeMirrorEditor = () => {
  let code = `export default {
    // Called when an error occurs.
    onError: function(event) {
   a + b
    },
};
`
  const mainApp = document.querySelector('main-app')

  const shadowRoot = mainApp.shadowRoot
  const screenSet = shadowRoot.querySelector('app-root')
  const iframe = screenSet.querySelector('iframe.console-app-iframe')

  const iframeDocument = iframe.contentDocument || iframe.contentWindow.document
  if (!iframeDocument) {
    console.log("iframe couldn't be found in DOM.")
    return
  }

  const mainAppIframe = iframeDocument.querySelectorAll('#screenSet')
  console.log('Original mainAppIframe:', mainAppIframe)
  const playground = mainAppIframe[0].querySelectorAll('#playground')
  console.log('Original playground:', playground)
  const codeMirrorClass = playground[0].querySelector('.CodeMirror')
  console.log('Original codeMirrorClass:', codeMirrorClass)
  codeMirrorClass.value = ''
  CodeMirror.fromTextArea(codeMirrorClass, {
    lineNumbers: true,
    mode: 'javascript',
    gutters: ['CodeMirror-lint-markers'],
    lint: true,
  })
  console.log(CodeMirror.lint.javascript(code))
  // Locate the existing CodeMirror instance
  // const existingCodeMirrorElement = document.querySelector('.CodeMirror.cm-s-default.CodeMirror-wrap')
}

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
