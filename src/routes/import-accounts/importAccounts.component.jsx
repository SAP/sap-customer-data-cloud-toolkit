/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */
import { withTranslation } from 'react-i18next'
import React, { useEffect } from 'react'
import { createUseStyles } from 'react-jss'
import styles from './import-accounts.styles.js'
import { selectCurrentSiteInformation, getCurrentSiteInformation } from '../../redux/copyConfigurationExtended/copyConfigurationExtendedSlice.js'
import { selectCredentials } from '../../redux/credentials/credentialsSlice.js'
import { getApiKey } from '../../redux/utils.js'
import { useDispatch, useSelector } from 'react-redux'
import { Card, CardHeader, Bar, Title, Text, TitleLevel, FlexBox, Grid, Button, Switch } from '@ui5/webcomponents-react'
import {
  getConfigurations,
  selectConfigurations,
  selectSwitchId,
  setConfigurationStatus,
  setConfigurations,
  setSwitchOptions,
} from '../../redux/importAccounts/importAccountsSlice.js'
import ImportAccountsConfigurations from '../../components/import-accounts-configurations/import-accounts-configurations.component.jsx'
const useStyles = createUseStyles(styles, { name: 'ImportAccounts' })
const PAGE_TITLE = 'Import Accounts'

const ImportAccountsComponent = ({ t }) => {
  const classes = useStyles()
  const dispatch = useDispatch()
  const credentials = useSelector(selectCredentials)
  const apikey = getApiKey(window.location.hash)

  const currentSiteInfo = useSelector(selectCurrentSiteInformation)
  const configurations = useSelector(selectConfigurations)
  const switchConfig = useSelector(selectSwitchId)
  useEffect(() => {
    dispatch(getCurrentSiteInformation())
    dispatch(getConfigurations())
  }, [dispatch, apikey, credentials, currentSiteInfo.dataCenter])

  const onSaveHandler = () => {
    dispatch(setConfigurations())
  }

  const showConfigurations = () => {
    return <ImportAccountsConfigurations configurations={configurations} setConfigurationStatus={setConfigurationStatus} />
  }

  return (
    <>
      <Bar
        design="Header"
        startContent={
          <>
            <Title id="importAccountsTitle" data-cy="importAccountsTitle" level={TitleLevel.H3} className={classes.titleStyle}>
              <span className={classes.titleSpanStyle}>{PAGE_TITLE}</span>
            </Title>
          </>
        }
      ></Bar>
      <div className={classes.outerDivStyle}>
        <div className={classes.headerOuterDivStyle}>
          <div className={classes.headerInnerDivStyle}>
            <FlexBox className={classes.headerTextFlexboxStyle}>
              <Text id="workBenchHeaderText" data-cy="workBenchHeaderText" className={classes.componentTextStyle}>
                {t('IMPORT_ACCOUNTS_COMPONENT_TEXT')}
              </Text>
            </FlexBox>
            <Card header={<CardHeader titleText={t('IMPORT_ACCOUNTS_DOWNLOAD_TEMPLATE_BUTTON')} />}>
              <Grid>
                <>
                  <div className={classes.currentInfoContainer} data-layout-span="XL5 L5 M5 S5">
                    <Title level="H4" className={classes.currentInfoContainerTitle}>
                      {t('IMPORT_ACCOUNTS_SELECT_SCHEMA_FIELDS')}
                    </Title>
                    <ui5-select>
                      <ui5-option>Full</ui5-option>
                      <ui5-option>Lite</ui5-option>
                    </ui5-select>

                    {showConfigurations()}
                  </div>
                </>
              </Grid>
              <div className={classes.selectConfigurationOuterDivStyle}>
                <div className={classes.selectConfigurationInnerDivStyle}>
                  <div>
                    <Button id="WorkBenchComponent" data-cy="WorkBenchComponent" className={classes.downloadTemplateButton} onClick={onSaveHandler}>
                      {t('IMPORT_ACCOUNTS_DOWNLOAD_TEMPLATE_BUTTON')}
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </>
  )
}

export default withTranslation()(ImportAccountsComponent)
