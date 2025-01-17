/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */

import { withTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createUseStyles } from 'react-jss'
import { Bar, Title, Text, TitleLevel, FlexBox, Grid, Button, Select, Option, Panel, Label } from '@ui5/webcomponents-react'
import styles from './import-accounts.styles.js'
import { selectCurrentSiteInformation, getCurrentSiteInformation } from '../../redux/copyConfigurationExtended/copyConfigurationExtendedSlice.js'
import { selectCredentials } from '../../redux/credentials/credentialsSlice.js'
import {
  getConfigurationTree,
  selectConfigurations,
  selectSugestionConfigurations,
  setConfigurationStatus,
  setConfigurations,
  setSelectedConfiguration,
  setSwitchOptions,
  selectIsLoading,
  clearConfigurations,
  setSuggestionClickConfiguration,
} from '../../redux/importAccounts/importAccountsSlice.js'
import ImportAccountsConfigurations from '../../components/import-accounts-configurations/import-accounts-configurations.component.jsx'
import SearchBar from '../../components/search-schema-input/search-schemas-input.component.jsx'
import { getApiKey } from '../../redux/utils.js'
import { areConfigurationsFilled } from '../copy-configuration-extended/utils.js'
import { trackUsage } from '../../lib/tracker.js'
import ServerImportComponent from '../server-import/server-import.component.jsx'

const useStyles = createUseStyles(styles, { name: 'ImportAccounts' })
const PAGE_TITLE = 'Import Data'

const ImportAccountsComponent = ({ t }) => {
  const classes = useStyles()
  const dispatch = useDispatch()
  const credentials = useSelector(selectCredentials)
  const apikey = getApiKey(window.location.hash)
  const isLoading = useSelector(selectIsLoading)
  const [schemaInputValue, setSchemaInputValue] = useState('')
  const [treeNodeInputValue, setTreeNodeInputValue] = useState('')
  const [expandableNode, setExpandableNode] = useState(false)
  const [accountOption, setAccountOption] = useState('Full')
  const [isCardExpanded, setExpanded] = useState(false)
  const currentSiteInfo = useSelector(selectCurrentSiteInformation)
  const configurations = useSelector(selectConfigurations)
  const selectedConfigurations = useSelector(selectSugestionConfigurations)

  useEffect(() => {
    dispatch(getCurrentSiteInformation())
    dispatch(getConfigurationTree('Full'))
  }, [dispatch, apikey, credentials, currentSiteInfo.dataCenter])

  const onSaveHandler = async () => {
    dispatch(setConfigurations(accountOption))
    await trackUsage({ featureName: PAGE_TITLE })
  }

  const handleSelectChange = (event) => {
    const selectedValue = event.target.value
    dispatch(getCurrentSiteInformation())
    dispatch(getConfigurationTree(selectedValue))
    setAccountOption(selectedValue)
  }

  const handleTreeNodeClick = (treeNodeId) => {
    if (treeNodeId) {
      dispatch(setSelectedConfiguration(treeNodeId))

      setTreeNodeInputValue(treeNodeId)
      setExpandableNode(true)
    } else {
      setTreeNodeInputValue()
      setExpandableNode(false)
    }
  }

  const handleSuggestionClick = (nodeId) => {
    if (nodeId) {
      dispatch(setSuggestionClickConfiguration({ checkBoxId: nodeId }))
      setTreeNodeInputValue(nodeId)
      setExpandableNode(true)
    } else {
      setTreeNodeInputValue()
      setExpandableNode(false)
    }
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
        dispatch={dispatch}
      />
    )
  }

  const onCancelHandler = () => {
    if (!isLoading) {
      dispatch(clearConfigurations())
    }
  }

  const handleToggleCard = () => {
    setExpanded(isCardExpanded)
  }

  return (
    <>
      <div className={classes.fullContainer}>
        <Bar
          design="Header"
          startContent={
            <>
              <Title id="importAccountsTitle" data-cy="importAccountsTitle" level={TitleLevel.H3} className={classes.titleStyle}>
                <span className={classes.pageTitleSpanStyle}>{PAGE_TITLE}</span>
              </Title>
            </>
          }
        ></Bar>
        <div className={classes.outerDivStyle}>
          <div className={classes.headerOuterDivStyle}>
            <FlexBox className={classes.headerTextFlexboxStyle}>
              <Text id="importAccountsHeaderText" data-cy="importAccountsHeaderText" className={classes.componentTextStyle}>
                {t('IMPORT_ACCOUNTS_COMPONENT_TEXT')}
              </Text>
            </FlexBox>
            <Panel
              id="importAccountsPanel"
              className={classes.panelContainer}
              headerText={t('IMPORT_ACCOUNTS_SELECT_SCHEMA_FIELDS')}
              collapsed={!isCardExpanded}
              onToggle={handleToggleCard}
              noAnimation={true}
            >
              <Label>{t('IMPORT_ACCOUNTS_FORM_HEADER_TEXT')}</Label>
              <Grid>
                <>
                  <div className={classes.currentInfoContainer} data-layout-span="XL5 L5 M5 S5">
                    <Title level={TitleLevel.H6} className={classes.currentInfoContainerTitle}>
                      {t('IMPORT_ACCOUNTS_SELECT_ACCOUNT_TYPE')}
                    </Title>
                    <Select id="importDataSelectAccount" className={classes.selectAccountDiv} onChange={handleSelectChange}>
                      <Option value={t('GLOBAL.FULL')}>{t('SERVER_IMPORT_COMPONENT.TEMPLATES_FULL_ACCOUNT')}</Option>
                      <Option value={t('GLOBAL.LITE')}>{t('SERVER_IMPORT_COMPONENT.TEMPLATES_LITE_ACCOUNT')}</Option>
                    </Select>
                  </div>
                  <div className={classes.searchBarGridItem} data-layout-span="XL7 L7 M7 S7">
                    <div className={classes.searchBarContainer}>
                      <SearchBar
                        dispatch={dispatch}
                        handleSuggestionClick={handleSuggestionClick}
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
              {showConfigurations(treeNodeInputValue ? selectedConfigurations : configurations)}
              <div className={classes.selectConfigurationOuterDivStyle}>
                <div className={classes.selectConfigurationInnerDivStyle}>
                  <Bar
                    design="Footer"
                    endContent={
                      <div>
                        <Button
                          type="submit"
                          id="importDataSaveButton"
                          className="fd-button fd-button--emphasized fd-button--compact"
                          onClick={onSaveHandler}
                          data-cy="importDataSaveButton"
                          design="Emphasized"
                          disabled={disableSaveButton()}
                        >
                          {t('IMPORT_ACCOUNTS_DOWNLOAD_TEMPLATE_BUTTON')}
                        </Button>
                        <Button
                          type="button"
                          id="importDataCancelButton"
                          data-cy="importDataCancelButton"
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
            </Panel>
          </div>
          <ServerImportComponent />
        </div>
      </div>
    </>
  )
}

export default withTranslation()(ImportAccountsComponent)
