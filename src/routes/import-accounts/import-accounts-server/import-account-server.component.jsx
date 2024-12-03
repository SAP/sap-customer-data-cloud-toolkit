/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */
import { withTranslation } from 'react-i18next'
import React from 'react'
import { createUseStyles } from 'react-jss'
import styles from './import-account-server.styles.js'

import ImportAccountsComponent from '../import-accounts.component'
import ServerImportComponent from '../server-import/server-import.component'
const useStyles = createUseStyles(styles, { name: 'Server Import' })
const AccountServerImport = ({ t }) => {
  const classes = useStyles()

  return (
    <>
      <div className={classes.container}>
        <ImportAccountsComponent />
        {/* <ServerImportComponent /> */}
      </div>
    </>
  )
}

export default withTranslation()(AccountServerImport)
