/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */
import { withTranslation } from 'react-i18next'
import React, { useState, useEffect } from 'react'
import { createUseStyles } from 'react-jss'
import styles from './import-accounts.styles.js'
import { selectCurrentSiteInformation, getCurrentSiteInformation } from '../../redux/copyConfigurationExtended/copyConfigurationExtendedSlice.js'
import { selectCredentials } from '../../redux/credentials/credentialsSlice.js'
import { getApiKey } from '../../redux/utils.js'
import { useDispatch, useSelector } from 'react-redux'
import { Card, CardHeader, Label, Bar, Title, Text, TitleLevel, FlexBox, Grid, Button, ValueState, BusyIndicator, MessageStrip } from '@ui5/webcomponents-react'
import ConfigurationTree from './customTree.component.jsx'
import { setConfigurationStatus } from '../../redux/copyConfigurationExtended/copyConfigurationExtendedSlice'
import { getConfigurations, selectConfigurations } from '../../redux/importAccounts/importAccountsSlice.js'
import ImportAccounts from '../../services/importAccounts/importAccounts.js'
const useStyles = createUseStyles(styles, { name: 'WorkBench' })
const PAGE_TITLE = 'Import Accounts'
const ConfigurationTreeComponent = (credentialsUpdated, apikey, currentSiteInfo) => {
  const [configurations, setConfigurations] = useState([])
  const dispatch = useDispatch()
  // Fetch configuration data using useEffect
  const getConfig = useSelector(selectConfigurations)
  console.log('getConfig', getConfig)
  useEffect(() => {
    const fetchConfigurations = async () => {
      try {
        if (credentialsUpdated && apikey && currentSiteInfo.dataCenter) {
          dispatch(getConfigurations()).then((value) => {
            console.log('value', value.payload)
          })
          dispatch(getCurrentSiteInformation())
          const importAccounts = await new ImportAccounts(credentialsUpdated, apikey, currentSiteInfo.dataCenter).importAccountToConfigTree()
          if (importAccounts) {
            console.log('importAccounts', importAccounts)
            setConfigurations(importAccounts)
          }
        }
      } catch (err) {
        console.error('Error fetching configurations:', err)
      }
    }

    fetchConfigurations()
  }, [credentialsUpdated, apikey, currentSiteInfo])

  return (
    <FlexBox alignItems="Stretch" direction="Column" justifyContent="Start" wrap="Wrap">
      {configurations.map((configuration) => (
        <ConfigurationTree key={configuration.id} {...configuration} setConfigurationStatus={setConfigurationStatus} />
      ))}
    </FlexBox>
  )
}
const ImportAccountsComponent = ({ t }) => {
  const classes = useStyles()

  const credentials = useSelector(selectCredentials)
  const apikey = getApiKey(window.location.hash)
  const currentSiteInfo = useSelector(selectCurrentSiteInformation)
  const credentialsUpdated = {
    userKey: credentials.userKey,
    secret: credentials.secretKey,
    gigyaConsole: credentials.gigyaConsole,
  }
  const handleGetServices = async () => {}
  // console.log('configs--->', configs)

  //Configurations
  // [{id,name,value,branches}]
  return (
    <>
      <Bar
        design="Header"
        startContent={
          <>
            <Title id="copyConfigurationExtendedPageTitle" data-cy="copyConfigurationExtendedPageTitle" level={TitleLevel.H3} className={classes.titleStyle}>
              <span className={classes.titleSpanStyle}>{PAGE_TITLE}</span>
            </Title>
          </>
        }
        className={classes.innerBarStyle}
      ></Bar>
      <div className={classes.outerDivStyle}>
        <div className={classes.headerOuterDivStyle}>
          <div className={classes.headerInnerDivStyle}>
            <FlexBox className={classes.headerTextFlexboxStyle}>
              <Text id="workBenchHeaderText" data-cy="workBenchHeaderText" className={classes.componentTextStyle}>
                {'Import accounts and generate csv with schema and legal fields'}
              </Text>
            </FlexBox>
            <Card header={<CardHeader titleText={'Download Template'} />}>
              <Grid>
                <>
                  <div className={classes.currentInfoContainer} data-layout-span="XL5 L5 M5 S5">
                    <Title level="H3" className={classes.currentInfoContainerTitle}>
                      {'Select Schema Fields'}
                    </Title>
                    <ui5-select>
                      <ui5-option>Full</ui5-option>
                      <ui5-option>Lite</ui5-option>
                    </ui5-select>
                    <Card className={classes.currentInfoContainerCard}>{ConfigurationTreeComponent(credentialsUpdated, apikey, currentSiteInfo)}</Card>
                    <Button id="WorkBenchComponent" data-cy="WorkBenchComponent" className={classes.singlePrettifyButton} onClick={handleGetServices}>
                      {'Download Template'}
                    </Button>
                  </div>
                </>
              </Grid>
            </Card>
          </div>
        </div>
      </div>
    </>
  )
}

export default withTranslation()(ImportAccountsComponent)
