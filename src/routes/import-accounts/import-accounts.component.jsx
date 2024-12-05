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
import { Card, CardHeader, Bar, Title, Text, TitleLevel, FlexBox, Grid, Button, Select, Option } from '@ui5/webcomponents-react'
import {
  getConfigurations,
  selectConfigurations,
  selectSugestionConfigurations,
  setConfigurationStatus,
  setConfigurations,
  setSelectedConfiguration,
  setSwitchOptions,
  selectIsLoading,
  clearConfigurations,
} from '../../redux/importAccounts/importAccountsSlice.js'
import ImportAccountsConfigurations from '../../components/import-accounts-configurations/import-accounts-configurations.component.jsx'
import SearchBar from '../../components/search-schema-input/search-schemas-input.component.jsx'

import { areConfigurationsFilled } from '../copy-configuration-extended/utils.js'
const useStyles = createUseStyles(styles, { name: 'ImportAccounts' })
const PAGE_TITLE = 'Import Accounts'

const ImportAccountsComponent = ({ t }) => {
  const classes = useStyles()
  const dispatch = useDispatch()
  const credentials = useSelector(selectCredentials)
  const apikey = getApiKey(window.location.hash)
  const isLoading = useSelector(selectIsLoading)
  const [schemaInputValue, setSchemaInputValue] = useState('')
  const [treeNodeInputValue, setTreeNodeInputValue] = useState('')
  const [expandableNode, setExpandableNode] = useState(false)
  const currentSiteInfo = useSelector(selectCurrentSiteInformation)
  const configurations = useSelector(selectConfigurations)
  const selectedConfigurations = useSelector(selectSugestionConfigurations)
  const [selectedTreeNodeId, setSelectedTreeNodeId] = useState([])
  console.log('configurations--->', configurations)
  useEffect(() => {
    dispatch(getCurrentSiteInformation())
    dispatch(getConfigurations('Full'))
  }, [dispatch, apikey, credentials, currentSiteInfo.dataCenter])

  const onSaveHandler = () => {
    dispatch(setConfigurations())
  }
  const handleSelectChange = (event) => {
    const selectedValue = event.target.value
    console.log('selectedValue', selectedValue)
    dispatch(getCurrentSiteInformation())
    dispatch(getConfigurations(selectedValue))
  }

  const handleTreeNodeClick = (treeNodeId) => {
    let parentNodes = configurations
    if (treeNodeId) {
      dispatch(setSelectedConfiguration(treeNodeId))
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
  const disableSaveButton = () => {
    return !areConfigurationsFilled(configurations) || isLoading
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
  const onCancelHandler = () => {
    if (!isLoading) {
      dispatch(clearConfigurations())
    }
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
          <Card className={classes.cardContainer}>
            <Title id="importAccountsTitle" data-cy="importAccountsTitle" level={TitleLevel.H3} className={classes.cardHeaderStyle}>
              <span className={classes.titleSpanStyle}>Select Schema Fields</span>
            </Title>
            <Grid>
              <>
                <div className={classes.currentInfoContainer} data-layout-span="XL5 L5 M5 S5">
                  <Title level="H4" className={classes.currentInfoContainerTitle}>
                    Select Account Type
                  </Title>
                  <Select onChange={handleSelectChange}>
                    <Option>Full</Option>
                    <Option>Lite</Option>
                  </Select>
                </div>
                <div className={classes.searchBarGridItem} data-layout-span="XL7 L7 M7 S7">
                  <div className={classes.searchBarContainer}>
                    <SearchBar
                      treeNodeInputValue={treeNodeInputValue}
                      configurations={configurations}
                      setSchemaInputValue={setSchemaInputValue}
                      schemaInputValue={schemaInputValue}
                      handleTreeNodeClick={handleTreeNodeClick}
                    />
                  </div>
                </div>
              </>
            </Grid>
            <div className={classes.configurationContainer}>{showConfigurations(treeNodeInputValue ? selectedConfigurations : configurations)}</div>

            <div className={classes.selectConfigurationOuterDivStyle}>
              <div className={classes.selectConfigurationInnerDivStyle}>
                <Bar
                  design="Footer"
                  endContent={
                    <div>
                      <Button
                        type="submit"
                        id="copyConfigExtendedSaveButton"
                        className="fd-button fd-button--emphasized fd-button--compact"
                        onClick={onSaveHandler}
                        data-cy="copyConfigExtendedSaveButton"
                        design="Emphasized"
                        disabled={disableSaveButton()}
                      >
                        Download Template
                      </Button>
                      <Button
                        type="button"
                        id="copyConfigExtendedCancelButton"
                        data-cy="copyConfigExtendedCancelButton"
                        className="fd-button fd-button--transparent fd-button--compact"
                        disabled={isLoading}
                        onClick={onCancelHandler}
                      >
                        {t('GLOBAL.CANCEL')}
                      </Button>
                    </div>
                  }
                ></Bar>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </>
  )
}

export default withTranslation()(ImportAccountsComponent)
