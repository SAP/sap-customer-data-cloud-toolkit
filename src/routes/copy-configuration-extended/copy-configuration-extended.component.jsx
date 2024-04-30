/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */

import { useEffect, useState } from 'react'
import { withTranslation } from 'react-i18next'
import { createUseStyles } from 'react-jss'
import { useDispatch, useSelector } from 'react-redux'

import { Card, CardHeader, Label, Bar, Title, Text, TitleLevel, FlexBox, Grid, Button, ValueState, BusyIndicator, MessageStrip } from '@ui5/webcomponents-react'

import DialogMessageInform from '../../components/dialog-message-inform/dialog-message-inform.component'
import MessageList from '../../components/message-list/message-list.component'
import SearchSitesInput from '../../components/search-sites-input/search-sites-input.component'
import SiteConfigurations from '../../components/site-configurations/site-configurations.component'
import TargetSitesTooltipIcon from '../../components/target-sites-tooltip-icon/target-sites-tooltip-icon.component'
import TargetApiKeysList from '../../components/target-api-keys-list/target-api-keys-list.component'

import {
  selectConfigurations,
  getConfigurations,
  addTargetSite,
  removeTargetSite,
  setConfigurations,
  clearConfigurations,
  selectShowSuccessDialog,
  selectIsLoading,
  selectTargetSites,
  clearTargetApiKeys,
  selectErrors,
  clearErrors,
  selectAvailableTargetSites,
  getCurrentSiteInformation,
  getTargetSiteInformation,
  selectCurrentSiteInformation,
  updateCurrentSiteApiKey,
  selectCurrentSiteApiKey,
  selectApiCardError,
  clearApiCardError,
  selectIsTargetInfoLoading,
  setAvailableTargetSitesFromLocalStorage,
  getAvailableTargetSites,
  setConfigurationStatus,
  setDataflowVariableValue,
  setDataflowVariableValues,
} from '../../redux/copyConfigurationExtended/copyConfigurationExtendedSlice'

import { selectCredentials } from '../../redux/credentials/credentialsSlice'

import { areCredentialsFilled } from '../../redux/credentials/utils'

import { cleanTreeVerticalScrolls, areConfigurationsFilled, sendReportOnWarnings } from './utils'
import { getApiKey } from '../../redux/utils'

import { ROUTE_COPY_CONFIG_EXTENDED } from '../../inject/constants'

import '@ui5/webcomponents-icons/dist/slim-arrow-right.js'
import '@ui5/webcomponents-icons/dist/add.js'
import '@ui5/webcomponents/dist/features/InputSuggestions.js'
import '@ui5/webcomponents-icons/dist/information.js'

import styles from './copy-configuration-extended.styles'

import { Tracker } from '../../tracker/tracker'

import { onSelectAllCheckboxChange, onSelectAllIncludeUrlChangeHandler } from '../../routes/copy-configuration-extended/utils'

const useStyles = createUseStyles(styles, { name: 'CopyConfigurationExtended' })

const PAGE_TITLE = 'Copy Configuration Extended'

const CopyConfigurationExtended = ({ t }) => {
  const classes = useStyles()
  const dispatch = useDispatch()

  const showSuccessDialog = useSelector(selectShowSuccessDialog)
  const isLoading = useSelector(selectIsLoading)
  const targetSites = useSelector(selectTargetSites)
  const credentials = useSelector(selectCredentials)
  const configurations = useSelector(selectConfigurations)
  const errors = useSelector(selectErrors)
  const availableTargetSites = useSelector(selectAvailableTargetSites)
  const currentSiteInformation = useSelector(selectCurrentSiteInformation)
  const currentSiteApiKey = useSelector(selectCurrentSiteApiKey)
  const apiCardError = useSelector(selectApiCardError)
  const isTargetInfoLoading = useSelector(selectIsTargetInfoLoading)

  const [tarketApiKeyInputValue, setTarketApiKeyInputValue] = useState('')
  const [selectAllCheckboxState, setSelectAllCheckboxState] = useState(false)
  const [unselectAllIncludeCheckboxState] = useState(false)

  window.navigation.onnavigate = (event) => {
    if (event.navigationType === 'replace' && window.location.hash.includes(ROUTE_COPY_CONFIG_EXTENDED)) {
      if (currentSiteApiKey !== getApiKey(window.location.hash)) {
        dispatch(updateCurrentSiteApiKey())
      }

      if (areCredentialsFilled(credentials) && currentSiteApiKey) {
        dispatch(getConfigurations())
        cleanTreeVerticalScrolls()
      }

      if (errors) {
        dispatch(clearErrors())
      }

      if (targetSites) {
        dispatch(clearTargetApiKeys())
      }

      setSelectAllCheckboxState(false)
    }
  }

  useEffect(() => {
    if (currentSiteApiKey === '') {
      dispatch(updateCurrentSiteApiKey())
    }

    if (areCredentialsFilled(credentials) && currentSiteApiKey) {
      dispatch(getAvailableTargetSites())
      dispatch(setAvailableTargetSitesFromLocalStorage(credentials.secretKey))
      dispatch(getConfigurations())
      dispatch(getCurrentSiteInformation())
      cleanTreeVerticalScrolls()
    }
  }, [dispatch, credentials, currentSiteApiKey])

  const onSaveHandler = () => {
    if (!disableSaveButton()) {
      if (errors.length) {
        dispatch(clearErrors())
      }
      dispatch(setConfigurations())
    }
  }

  const onCancelHandler = () => {
    if (!isLoading) {
      setTarketApiKeyInputValue('')
      dispatch(clearConfigurations())
      dispatch(clearTargetApiKeys())
      dispatch(clearErrors())
      setSelectAllCheckboxState(false)
    }
  }

  const onSuccessDialogAfterCloseHandler = () => {
    setTarketApiKeyInputValue('')
    dispatch(clearConfigurations())
    dispatch(clearTargetApiKeys())
    setSelectAllCheckboxState(false)
    Tracker.reportUsage()
  }

  const onTarketApiKeyDeleteHandler = (event) => {
    dispatch(removeTargetSite(event.detail.item.dataset.apikey))
  }

  const onSelectAllCheckboxChangeHandler = (event) => {
    const value = event.srcElement.checked
    setSelectAllCheckboxState(value)
    configurations.forEach((configuration) => {
      const checkBoxId = configuration.id
      dispatch(setConfigurationStatus({ checkBoxId, value }))
    })
  }

  //const onSelectAllCheckboxChangeHandler = onSelectAllCheckboxChange(null, setSelectAllCheckboxState, configurations, dispatch)

  const onSelectAllIncludeUrlChangeHandlerWrapper = () => {
    onSelectAllIncludeUrlChangeHandler(dispatch, configurations)
  }

  const showSuccessMessage = () => (
    <DialogMessageInform
      open={showSuccessDialog}
      headerText={t('GLOBAL.SUCCESS')}
      state={ValueState.Success}
      closeButtonContent={t('GLOBAL.BUTTON_REPORT_USAGE')}
      onAfterClose={onSuccessDialogAfterCloseHandler}
      id="copyConfigSuccessPopup"
      data-cy="copyConfigSuccessPopup"
    >
      <Text>{t('GLOBAL.REPORT_USAGE')}</Text>
    </DialogMessageInform>
  )

  const disableSaveButton = () => {
    return targetSites.length === 0 || !areConfigurationsFilled(configurations) || isLoading
  }

  const showConfigurations = () => {
    return (
      <SiteConfigurations
        configurations={configurations}
        selectAllCheckboxState={selectAllCheckboxState}
        unselectAllIncludeCheckboxState={unselectAllIncludeCheckboxState}
        onSelectAllCheckboxChangeHandler={onSelectAllCheckboxChangeHandler}
        setConfigurationStatus={setConfigurationStatus}
        setDataflowVariableValue={setDataflowVariableValue}
        setDataflowVariableValues={setDataflowVariableValues}
        onSelectAllIncludeUrlChangeHandler={onSelectAllIncludeUrlChangeHandlerWrapper}
      />
    )
  }

  const showErrorList = () => {
    sendReportOnWarnings(errors)

    return errors.length ? (
      <div className={classes.errorListOuterDivStyle}>
        <div className={classes.errorListInnerDivStyle}>
          <Card id="errorListContainer" data-cy="errorListContainer">
            <MessageList messages={errors} />
          </Card>
        </div>
      </div>
    ) : (
      ''
    )
  }

  const showBusyIndicator = () => {
    return isLoading || !availableTargetSites.length ? <BusyIndicator active delay="1" className={classes.busyIndicatorStyle} /> : ''
  }

  const showTargetApiKeys = () => {
    return <TargetApiKeysList id="copyConfigurationExtendedTargets" targetSites={targetSites} onTarketApiKeyDeleteHandler={onTarketApiKeyDeleteHandler} />
  }

  const onMessageStripCloseHandler = () => {
    dispatch(clearApiCardError())
  }

  const showMessageStripError = () => {
    return apiCardError ? (
      <MessageStrip id="messageStripError" data-cy="messageStripError" design="Negative" onClose={onMessageStripCloseHandler}>
        {apiCardError.errorMessage}
      </MessageStrip>
    ) : (
      ''
    )
  }

  const showGetTargetInfoBusyIndicator = () => {
    return isTargetInfoLoading ? <BusyIndicator active delay="1" className={classes.busyIndicatorStyle} /> : ''
  }

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
      ></Bar>

      <div className={classes.outerDivStyle}>
        <div className={classes.headerOuterDivStyle}>
          <div className={classes.headerInnerDivStyle}>
            <FlexBox className={classes.headerTextFlexboxStyle}>
              <Text id="copyConfigExtendedHeaderText" data-cy="copyConfigExtendedHeaderText" className={classes.componentTextStyle}>
                {t('COPY_CONFIGURATION_EXTENDED.HEADER_TEXT')}
              </Text>
            </FlexBox>

            <Card header={<CardHeader titleText={t('COPY_CONFIGURATION_EXTENDED.SELECT_TARGET_SITES')} />}>
              <Grid>
                <>
                  <div className={classes.currentInfoContainer} data-layout-span="XL5 L5 M5 S5">
                    <Title level="H3" className={classes.currentInfoContainerTitle}>
                      {t('COPY_CONFIGURATION_EXTENDED.FROM')}
                    </Title>

                    <Card className={classes.currentInfoContainerCard}>
                      <table className={classes.currentInfoContainerCardTable}>
                        <tbody>
                          <tr>
                            <td>
                              <Label id="currentSiteLabel" data-cy="currentSiteLabel">
                                {t('COPY_CONFIGURATION_EXTENDED.SITE_DOMAIN')}
                              </Label>
                            </td>
                            <td>
                              <Text id="currentSiteName" data-cy="currentSiteName">
                                {currentSiteInformation.baseDomain}
                              </Text>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <Label id="currentSiteApiKeyLabel" data-cy="currentSiteApiKeyLabel">
                                {t('COPY_CONFIGURATION_EXTENDED.API_KEY')}
                              </Label>
                            </td>
                            <td>
                              <Text> {currentSiteApiKey} </Text>
                            </td>
                          </tr>
                          {/* <tr>
                            <td>
                              <Label>{t('COPY_CONFIGURATION_EXTENDED.PARTNER')}</Label>
                            </td>
                            <td>
                              <Text>Partner Name Here (99999999)</Text>
                            </td>
                          </tr> */}
                        </tbody>
                      </table>
                    </Card>
                  </div>

                  <div className={classes.iconContainer} data-layout-span="XL2 L2 M2 S2">
                    <ui5-icon class={classes.iconContainerIcon} name="slim-arrow-right"></ui5-icon>
                  </div>

                  <div className={classes.targetInfoContainer} data-layout-span="XL5 L5 M5 S5">
                    <TargetSitesTooltipIcon title={t('COPY_CONFIGURATION_EXTENDED.TO')} />
                    <Card id="copyConfigurationExtendedSearchSitesInputCard" data-cy="copyConfigurationExtendedSearchSitesInputCard">
                      <div className={classes.targetInfoContainerInputContainer}>
                        <SearchSitesInput
                          tarketApiKeyInputValue={tarketApiKeyInputValue}
                          setTarketApiKeyInputValue={setTarketApiKeyInputValue}
                          addTargetSite={addTargetSite}
                          getTargetSiteInformation={getTargetSiteInformation}
                        />
                        {showGetTargetInfoBusyIndicator()}
                        {showMessageStripError()}
                      </div>
                    </Card>

                    {targetSites.length ? (
                      <>
                        <Title level={TitleLevel.H5} className={classes.targetSitesListTitle}>
                          {t('COPY_CONFIGURATION_EXTENDED.TARGET_LIST')}
                        </Title>
                        <Card className={classes.targetSitesListContainer}>{showTargetApiKeys()}</Card>{' '}
                      </>
                    ) : (
                      ''
                    )}
                  </div>
                </>
              </Grid>
            </Card>
          </div>
        </div>
        {showBusyIndicator()}
        {showConfigurations()}
        {showErrorList()}
        <div className={classes.selectConfigurationOuterDivStyle}>
          <div className={classes.selectConfigurationInnerDivStyle}>
            <Card>
              <Bar
                design="FloatingFooter"
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
                      {t('GLOBAL.SAVE')}
                    </Button>
                    <Button
                      type="button"
                      id="copyConfigExtendedCancelButton"
                      data-cy="copyConfigExtendedCancelButton"
                      className="fd-button fd-button--transparent fd-button--compact"
                      onClick={onCancelHandler}
                      disabled={isLoading}
                    >
                      {t('GLOBAL.CANCEL')}
                    </Button>
                  </div>
                }
              ></Bar>
            </Card>
          </div>
        </div>
      </div>

      {showSuccessMessage()}
    </>
  )
}

export default withTranslation()(CopyConfigurationExtended)
