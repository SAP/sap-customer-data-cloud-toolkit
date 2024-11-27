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
import { Card, CardHeader, Bar, Title, Text, TitleLevel, FlexBox, Grid, Button } from '@ui5/webcomponents-react'
import {
  getConfigurations,
  selectConfigurations,
  selectSugestionConfigurations,
  setConfigurationStatus,
  setConfigurations,
  setSelectedConfiguration,
  setSwitchOptions,
} from '../../redux/importAccounts/importAccountsSlice.js'
import ImportAccountsConfigurations from '../../components/import-accounts-configurations/import-accounts-configurations.component.jsx'
import SearchBar from '../../components/search-schema-input/search-schemas-input.component.jsx'
import { getAllParentNodes } from './utils.js'
const useStyles = createUseStyles(styles, { name: 'ImportAccounts' })
const PAGE_TITLE = 'Import Accounts'

const ImportAccountsComponent = ({ t }) => {
  const classes = useStyles()
  const dispatch = useDispatch()
  const credentials = useSelector(selectCredentials)
  const apikey = getApiKey(window.location.hash)

  const [schemaInputValue, setSchemaInputValue] = useState('')
  const [treeNodeInputValue, setTreeNodeInputValue] = useState('')
  const [expandableNode, setExpandableNode] = useState(false)
  const currentSiteInfo = useSelector(selectCurrentSiteInformation)
  const configurations = useSelector(selectConfigurations)
  const selectedConfigurations = useSelector(selectSugestionConfigurations)
  const [selectedTreeNodeId, setSelectedTreeNodeId] = useState([])

  useEffect(() => {
    dispatch(getCurrentSiteInformation())
    dispatch(getConfigurations())
  }, [dispatch, apikey, credentials, currentSiteInfo.dataCenter])

  const onSaveHandler = () => {
    dispatch(setConfigurations())
  }

  const handleTreeNodeClick = (treeNodeId) => {
    let parentNodes = configurations
    if (treeNodeId) {
      // parentNodes = getAllParentNodes(configurations, treeNodeId)
      dispatch(setSelectedConfiguration(treeNodeId))
      console.log('PARENT selectedConfigurations--->', selectedConfigurations)
      // setSelectedTreeNodeId(parentNodes)
      setTreeNodeInputValue(treeNodeId)
      setExpandableNode(true)
    } else {
      setTreeNodeInputValue()
      setExpandableNode(false)
    }
  }
  console.log('OUTSIDE selectedConfigurations--->', selectedConfigurations)

  const getObjectById = (data, id) => {
    for (let item of data) {
      if (item.id === id) {
        return item
      }
      if (item.branches && item.branches.length > 0) {
        const result = getObjectById(item.branches, id)
        if (result) {
          return result
        }
      }
    }
    return null
  }
  const showConfigurations = (config) => {
    return (
      <ImportAccountsConfigurations
        configurations={config}
        expandableNode={expandableNode}
        setConfigurationStatus={setConfigurationStatus}
        setSwitchOptions={setSwitchOptions}
        treeNodeInputValue={treeNodeInputValue}
        selectedTreeNodeId={selectedTreeNodeId}
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
                    treeNodeInputValue={treeNodeInputValue}
                    configurations={configurations}
                    setSchemaInputValue={setSchemaInputValue}
                    schemaInputValue={schemaInputValue}
                    handleTreeNodeClick={handleTreeNodeClick}
                  />
                </div>
              </>
            </Grid>
            {showConfigurations(treeNodeInputValue ? selectedConfigurations : configurations)}
            <FlexBox justifyContent="End" className={classes.buttonContainer}>
              <Button id="WorkBenchComponent" data-cy="WorkBenchComponent" className={classes.downloadTemplateButton} onClick={onSaveHandler}>
                {t('IMPORT_ACCOUNTS_DOWNLOAD_TEMPLATE_BUTTON')}
              </Button>
            </FlexBox>
          </Card>
        </div>
      </div>
    </>
  )
}

export default withTranslation()(ImportAccountsComponent)
