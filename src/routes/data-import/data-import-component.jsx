import React from 'react'
import styles from './data-import.styles.js'
import ImportAccountsComponent from '../import-accounts/import-accounts.component.jsx'
import ServerImportAccountComponent from '../server-import/server-import-account.component.jsx'
import { createUseStyles } from 'react-jss'
const DataImportContainer = () => {
  const useStyles = createUseStyles(styles, { name: 'Server Import' })
  const classes = useStyles()
  return (
    <div className={classes.dataImportContainer}>
      <div className={classes.importAccountsConfigurations}>
        <ImportAccountsComponent />
      </div>
      <div className={classes.serverImportComponent}>
        <ServerImportAccountComponent />
      </div>
    </div>
  )
}

export default DataImportContainer
