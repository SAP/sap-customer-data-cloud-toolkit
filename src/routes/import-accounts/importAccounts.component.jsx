/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */
import { withTranslation } from 'react-i18next'
import React, { useEffect, useState } from 'react'
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
  setSugestionSchema,
  setSwitchOptions,
} from '../../redux/importAccounts/importAccountsSlice.js'
import ImportAccountsConfigurations from '../../components/import-accounts-configurations/import-accounts-configurations.component.jsx'
import SearchBar from '../../components/search-schema-input/search-schemas-input.component.jsx'
import { extractTreeNodeIds, getAllNames } from './utils.js'
const useStyles = createUseStyles(styles, { name: 'ImportAccounts' })
const PAGE_TITLE = 'Import Accounts'

const ImportAccountsComponent = ({ t }) => {
  const classes = useStyles()
  const dispatch = useDispatch()
  const credentials = useSelector(selectCredentials)
  const apikey = getApiKey(window.location.hash)
  const [selectedValues, setSelectedValues] = useState({})
  const [treeNodeIds, setTreeNodeIds] = useState([])
  const [schemaInputValue, setSchemaInputValue] = useState('')
  const currentSiteInfo = useSelector(selectCurrentSiteInformation)
  const configurations = useSelector(selectConfigurations)
  console.log('CONFIGURATIONS--->', configurations)
  const switchConfig = useSelector(selectSwitchId)
  useEffect(() => {
    dispatch(getCurrentSiteInformation())
    dispatch(getConfigurations())
  }, [dispatch, apikey, credentials, currentSiteInfo.dataCenter])

  const onSaveHandler = () => {
    dispatch(setConfigurations())
  }

  const handleSelectChange = (event, treeNodeId) => {
    const selectedValue = event.target.selectedOption.dataset.id
    console.log(`Selected value: ${selectedValue}, TreeNode ID: ${treeNodeId}`)
    setSelectedValues((prevValues) => ({
      ...prevValues,
      [treeNodeId]: selectedValue,
    }))
  }

  const showConfigurations = () => {
    return (
      <ImportAccountsConfigurations
        handleSelectChange={handleSelectChange}
        configurations={configurations}
        setConfigurationStatus={setConfigurationStatus}
        setSwitchOptions={setSwitchOptions}
      />
    )
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
                  </div>
                  <div className={classes.searchBarContainer} data-layout-span="XL5 L5 M5 S5">
                    <SearchBar
                      dispatch={dispatch}
                      treeNodeIds={treeNodeIds}
                      configurations={configurations}
                      setSchemaInputValue={setSchemaInputValue}
                      setSugestionSchema={setSugestionSchema}
                    />
                  </div>
                </>
              </Grid>
              {showConfigurations()}
              <FlexBox justifyContent="End" className={classes.buttonContainer}>
                <Button id="WorkBenchComponent" data-cy="WorkBenchComponent" className={classes.downloadTemplateButton} onClick={onSaveHandler}>
                  {t('IMPORT_ACCOUNTS_DOWNLOAD_TEMPLATE_BUTTON')}
                </Button>
              </FlexBox>
            </Card>
          </div>
        </div>
      </div>
    </>
  )
}

export default withTranslation()(ImportAccountsComponent)
