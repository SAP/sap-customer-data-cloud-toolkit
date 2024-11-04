/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */

import React from 'react'
import { withTranslation } from 'react-i18next'
import { createUseStyles } from 'react-jss'

import { Card, CardHeader, FlexBox } from '@ui5/webcomponents-react'

import ConfigurationTree from '../../components/configuration-tree/configuration-tree.component'

import styles from './import-account-configurations.styles'

const useStyles = createUseStyles(styles, { name: 'CopyConfigurationExtended' })

const SiteConfigurations = ({ configurations, setConfigurationStatus, t }) => {
  const classes = useStyles()

  return configurations && configurations.length ? (
    <div className={classes.selectConfigurationOuterDivStyle}>
      <div className={classes.selectConfigurationInnerDivStyle}>
        <Card id="importAccountsCard" data-cy="importAccountsCard" header={<CardHeader titleText={t('IMPORT_ACCOUNTS_SCHEMA_CONFIGURATION')} />}>
          <FlexBox alignItems="Stretch" direction="Column" justifyContent="Start" wrap="Wrap">
            {configurations.map((configuration) => (
              <ConfigurationTree key={configuration.id} {...configuration} setConfigurationStatus={setConfigurationStatus} />
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
