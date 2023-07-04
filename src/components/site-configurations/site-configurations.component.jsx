/*
 * Copyright (c) 2023 SAP SE or an SAP affiliate company.
 * All rights reserved.
 *
 * This software is the confidential and proprietary information of SAP
 * ("Confidential Information"). You shall not disclose such Confidential
 * Information and shall use it only in accordance with the terms of the
 * license agreement you entered into with SAP.
 */

import { withTranslation } from 'react-i18next'
import { createUseStyles } from 'react-jss'

import { Card, CardHeader, FlexBox, CheckBox } from '@ui5/webcomponents-react'

import ConfigurationTree from '../../components/configuration-tree/configuration-tree.component'

import styles from './site-configurations.styles'

const useStyles = createUseStyles(styles, { name: 'CopyConfigurationExtended' })

const SiteConfigurations = ({
  siteId,
  configurations,
  selectAllCheckboxState,
  onSelectAllCheckboxChangeHandler,
  setConfigurationStatus,
  setDataflowVariableValue,
  setDataflowVariableValues,
  t,
}) => {
  const classes = useStyles()

  return configurations && configurations.length ? (
    <div className={classes.selectConfigurationOuterDivStyle}>
      <div className={classes.selectConfigurationInnerDivStyle}>
        <Card
          id="siteConfigurationsCard"
          data-cy="siteConfigurationsCard"
          header={
            <CardHeader
              titleText={t('COPY_CONFIGURATION_EXTENDED.SELECT_CONFIGURATION')}
              action={
                <CheckBox
                  id="selectAllCheckbox"
                  data-cy="selectAllCheckbox"
                  checked={selectAllCheckboxState}
                  text={t('COPY_CONFIGURATION_EXTENDED.SELECT_ALL')}
                  onChange={onSelectAllCheckboxChangeHandler}
                />
              }
            />
          }
        >
          <FlexBox alignItems="Stretch" direction="Column" justifyContent="Start" wrap="Wrap">
            {configurations.map((configuration) => (
              <ConfigurationTree
                key={configuration.id}
                {...configuration}
                siteId={siteId}
                setConfigurationStatus={setConfigurationStatus}
                setDataflowVariableValue={setDataflowVariableValue}
                setDataflowVariableValues={setDataflowVariableValues}
              />
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