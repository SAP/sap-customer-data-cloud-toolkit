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
import 'codemirror/lib/codemirror.css'
const CodeMirrorEditor = () => {
  const linter = new CodeLinter()
  console.log('linter', linter.codeLinter())
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
