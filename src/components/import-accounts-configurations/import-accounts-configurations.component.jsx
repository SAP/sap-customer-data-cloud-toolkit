/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */

import React, { useState } from 'react'
import { withTranslation } from 'react-i18next'
import { createUseStyles } from 'react-jss'
import { useDispatch } from 'react-redux'
import { Card, CardHeader, FlexBox, Switch } from '@ui5/webcomponents-react'

import ImportAccountsConfigurationTree from '../import-account-configuration-tree/import-accounts-configuration-tree.component'
import styles from './import-account-configurations.styles'
import { setSwitchOptions } from '../../redux/importAccounts/importAccountsSlice'

const useStyles = createUseStyles(styles, { name: 'CopyConfigurationExtended' })

const SiteConfigurations = ({ configurations, setConfigurationStatus, t }) => {
  const classes = useStyles()
  const dispatch = useDispatch()
  const [isChecked, setIsChecked] = useState(false)
  const handleSwitchChange = (event) => {
    setIsChecked(event.target.checked)
    if (!isChecked) {
      console.log('IS CHECKED false', isChecked)
      dispatch(setSwitchOptions({ switchId: 'object' }))
    } else {
      dispatch(setSwitchOptions({ switchId: 'array' }))
      console.log('IS CHECKED true', isChecked)
    }
  }
  return configurations && configurations.length ? (
    <div className={classes.selectConfigurationOuterDivStyle}>
      <div className={classes.selectConfigurationInnerDivStyle}>
        <Switch textOn="Array" textOff="Object" checked={isChecked} onChange={handleSwitchChange} className={classes.customSwitch}></Switch>
        <Card id="importAccountsCard" data-cy="importAccountsCard" header={<CardHeader titleText={t('IMPORT_ACCOUNTS_SCHEMA_CONFIGURATION')} />}>
          <FlexBox alignItems="Stretch" direction="Column" justifyContent="Start" wrap="Wrap">
            {configurations.map((configuration) => (
              <ImportAccountsConfigurationTree key={configuration.id} {...configuration} setConfigurationStatus={setConfigurationStatus} />
            ))}
          </FlexBox>
        </Card>
      </div>
    </div>
  ) : (
    ''
  )
}

export default withTranslation()(SiteConfigurations)
