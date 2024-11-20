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
  setSingleConfigurationStatus,
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
  const [treeNodeInputValue, setTreeNodeInputValue] = useState('')
  const currentSiteInfo = useSelector(selectCurrentSiteInformation)
  const configurations = useSelector(selectConfigurations)
  console.log('CONFIGURATIONS--->', configurations)
  const switchConfig = useSelector(selectSwitchId)
  const [selectedTreeNodeId, setSelectedTreeNodeId] = useState([])

  useEffect(() => {
    dispatch(getCurrentSiteInformation())
    dispatch(getConfigurations())
  }, [dispatch, apikey, credentials, currentSiteInfo.dataCenter])

  const onSaveHandler = () => {
    dispatch(setConfigurations())
  }
  const checkParentNode = (treeNodeId) => {
    const parentNode = getParentBranchById(configurations, treeNodeId)
    if (parentNode) {
      dispatch(setSingleConfigurationStatus({ checkBoxId: parentNode.id, value: true }))
    }

    console.log('parentNodeafter-->', parentNode)
  }
  const getParentBranchById = (branches, id) => {
    let parent = null

    function findParent(branches, parentNode) {
      for (let branch of branches) {
        if (branch.id === id) {
          parent = parentNode
          return true
        }
        if (branch.branches && branch.branches.length > 0) {
          if (findParent(branch.branches, branch)) {
            return true
          }
        }
      }
      return false
    }

    findParent(branches, null)
    return parent
  }
  const handleSelectChange = (event, treeNodeId) => {
    const selectedValue = event.target.selectedOption.dataset.id
    console.log(`Selected value: ${selectedValue}, TreeNode ID: ${treeNodeId}`)
    setSelectedValues((prevValues) => ({
      ...prevValues,
      [treeNodeId]: selectedValue,
    }))
  }
  const handleTreeNodeClick = (treeNodeId) => {
    console.log('treeNodeId-->', treeNodeId)
    console.log('config-->', configurations)
    const object = getObjectById(configurations, treeNodeId)
    if (object) {
      setSelectedTreeNodeId([object])
    }
    setTreeNodeInputValue(treeNodeId)
    console.log('selectedObject-->', selectedTreeNodeId)
  }
  const getObjectById = (data, id) => {
    for (let item of data) {
      if (item.id === id) {
        return item
      }
      if (item.branches && item.branches.length > 0) {
        const result = getObjectById(item.branches, id)
        if (result) {
          console.log('result-->', result)
          return result
        }
      }
    }
    return null
  }
  const showConfigurations = (config) => {
    return (
      <ImportAccountsConfigurations
        handleSelectChange={handleSelectChange}
        configurations={config}
        setConfigurationStatus={setConfigurationStatus}
        setSwitchOptions={setSwitchOptions}
        checkParentNode={checkParentNode}
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
                      schemaInputValue={schemaInputValue}
                      handleTreeNodeClick={handleTreeNodeClick} // Pass the click handler to SearchBar
                    />
                  </div>
                </>
              </Grid>
              {showConfigurations(treeNodeInputValue ? selectedTreeNodeId : configurations)}{' '}
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
