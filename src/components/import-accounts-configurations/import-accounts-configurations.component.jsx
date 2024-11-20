/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */

import React, { useState } from 'react'
import { withTranslation } from 'react-i18next'
import { createUseStyles } from 'react-jss'
import { Card, CardHeader, FlexBox } from '@ui5/webcomponents-react'
import ImportAccountsConfigurationTree from '../import-account-configuration-tree/import-accounts-configuration-tree.component'
import styles from './import-account-configurations.styles'

const useStyles = createUseStyles(styles, { name: 'CopyConfigurationExtended' })

const SiteConfigurations = ({ configurations, handleSelectChange, setSwitchOptions, checkParentNode, setConfigurationStatus, t }) => {
  const classes = useStyles()

  return configurations && configurations.length ? (
    <div className={classes.selectConfigurationOuterDivStyle}>
      <div className={classes.selectConfigurationInnerDivStyle}>
        <div id="importAccountsCard" data-cy="importAccountsCard" header={<CardHeader titleText={t('IMPORT_ACCOUNTS_SCHEMA_CONFIGURATION')} />}>
          {configurations.map((configuration) => (
            <ImportAccountsConfigurationTree
              key={configuration.id}
              {...configuration}
              handleSelectChange={handleSelectChange}
              setConfigurationStatus={setConfigurationStatus}
              setSwitchOptions={setSwitchOptions}
              checkParentNode={checkParentNode}
            />
          ))}
        </div>
      </div>
    </div>
  ) : (
    ''
  )
}

export default withTranslation()(SiteConfigurations)
