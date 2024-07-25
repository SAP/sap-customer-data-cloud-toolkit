/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */

import React from 'react'
import { withTranslation } from 'react-i18next'
import { createUseStyles } from 'react-jss'

import { Button, Card, CardHeader, CheckBox, FlexBox } from '@ui5/webcomponents-react'

import ConfigurationTree from '../../components/configuration-tree/configuration-tree.component'

import styles from './site-configurations.styles'

const useStyles = createUseStyles(styles, { name: 'CopyConfigurationExtended' })

const SiteConfigurations = ({
  siteId,
  configurations,
  selectAllCheckboxState,
  onSelectAllCheckboxChangeHandler,
  onSelectAllIncludeUrlChangeHandler,
  setConfigurationStatus,
  setDataflowVariableValue,
  setDataflowVariableValues,
  setRbaRulesOperation,
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
                <>
                  <Button
                    id="removeIncludedUrlButton"
                    data-cy="removeIncludedUrlButton"
                    design="Default"
                    className={classes.removeIncludedUrlButton}
                    onClick={() => onSelectAllIncludeUrlChangeHandler({ srcElement: { checked: false } })}
                  >
                    {t('COPY_CONFIGURATION_EXTENDED.REMOVE_INCLUDED_URL_BUTTON')}
                  </Button>

                  <CheckBox
                    id="selectAllCheckbox"
                    data-cy="selectAllCheckbox"
                    checked={selectAllCheckboxState}
                    text={t('COPY_CONFIGURATION_EXTENDED.SELECT_ALL')}
                    onChange={onSelectAllCheckboxChangeHandler}
                  />
                </>
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
                setRbaRulesOperation={setRbaRulesOperation}
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
