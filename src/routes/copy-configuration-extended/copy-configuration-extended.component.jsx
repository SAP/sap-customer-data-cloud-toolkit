import { withTranslation } from 'react-i18next'
import { createUseStyles } from 'react-jss'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import lodash from 'lodash'

import {
  Card,
  CardHeader,
  Input,
  InputType,
  Label,
  Bar,
  Title,
  Text,
  TitleLevel,
  FlexBox,
  Grid,
  Button,
  ValueState,
  BusyIndicator,
  List,
  CustomListItem,
  SuggestionItem,
  MessageStrip,
  Icon,
  Popover,
  CheckBox,
} from '@ui5/webcomponents-react'

import ConfigurationTree from '../../components/configuration-tree/configuration-tree.component'
import DialogMessageInform from '../../components/dialog-message-inform/dialog-message-inform.component'
import MessageList from '../../components/message-list/message-list.component'
import MessagePopoverButton from '../../components/message-popover-button/message-popover-button.component'

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
} from '../../redux/copyConfigurationExtended/copyConfigurationExtendedSlice'

import { selectCredentials } from '../../redux/credentials/credentialsSlice'

import { areCredentialsFilled } from '../../redux/credentials/utils'

import { cleanTreeVerticalScrolls, areConfigurationsFilled, filterTargetSites, getTargetSiteByTargetApiKey, findStringInAvailableTargetSites } from './utils'
import { getApiKey } from '../../redux/utils'

import { ROUTE_COPY_CONFIG_EXTENDED } from '../../inject/constants'

import '@ui5/webcomponents-icons/dist/slim-arrow-right.js'
import '@ui5/webcomponents-icons/dist/add.js'
import '@ui5/webcomponents/dist/features/InputSuggestions.js'
import '@ui5/webcomponents-icons/dist/information.js'

import styles from './copy-configuration-extended.styles'

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
  const [filteredAvailableTargetSites, setFilteredAvailableTargetApiKeys] = useState(availableTargetSites)

  const [isMouseOverIcon, setIsMouseOverIcon] = useState(false)
  const [tooltipTarget, setTooltipTarget] = useState('')

  window.navigation.onnavigate = (event) => {
    if (event.navigationType === 'replace' && currentSiteApiKey !== getApiKey(window.location.hash) && window.location.hash.includes(ROUTE_COPY_CONFIG_EXTENDED)) {
      dispatch(updateCurrentSiteApiKey())
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
    if (errors.length) {
      dispatch(clearErrors())
    }
    dispatch(setConfigurations())
  }

  const onCancelHandler = () => {
    setTarketApiKeyInputValue('')
    dispatch(clearConfigurations())
    dispatch(clearTargetApiKeys())
    dispatch(clearErrors())
  }

  const onTargetApiKeysInputHandler = lodash.debounce((event) => {
    const inputValue = event.target.value
    setTarketApiKeyInputValue(inputValue)
    setFilteredAvailableTargetApiKeys(filterTargetSites(inputValue, availableTargetSites))
  }, 500)

  const onTargetApiKeysInputKeyPressHandler = (event) => {
    const inputValue = event.target.value
    if (event.key === 'Enter' && !findStringInAvailableTargetSites(inputValue, availableTargetSites)) {
      setTarketApiKeyInputValue(inputValue)
      processInput(inputValue)
    }
  }

  const onAddTargetSiteButtonClickHandler = () => {
    processInput(tarketApiKeyInputValue)
  }

  const processInput = (inputValue) => {
    if (inputValue && inputValue !== '') {
      dispatch(getTargetSiteInformation(inputValue))
      setTarketApiKeyInputValue('')
    }
  }

  const onSuccessDialogAfterCloseHandler = () => {
    setTarketApiKeyInputValue('')
    dispatch(clearConfigurations())
    dispatch(clearTargetApiKeys())
  }

  const onTarketApiKeyDeleteHandler = (event) => {
    dispatch(removeTargetSite(event.detail.item.dataset.apikey))
  }

  const onSuggestionItemSelectHandler = (event) => {
    const targetSite = getTargetSiteByTargetApiKey(event.detail.item.additionalText, availableTargetSites)
    setTarketApiKeyInputValue('')
    dispatch(addTargetSite(targetSite))
  }

  const onSelectAllCheckboxChangeHandler = (event) => {
    const value = event.srcElement.checked
    configurations.forEach((configuration) => {
      const checkBoxId = configuration.id
      dispatch(setConfigurationStatus({ checkBoxId, value }))
    })
  }

  const showSuccessMessage = () => (
    <DialogMessageInform
      open={showSuccessDialog}
      headerText={t('GLOBAL.SUCCESS')}
      state={ValueState.Success}
      closeButtonContent={t('GLOBAL.OK')}
      onAfterClose={onSuccessDialogAfterCloseHandler}
      id="copyConfigSuccessPopup"
    >
      <Text>{t('COPY_CONFIGURATION_EXTENDED.COPY_SUCCESS_MESSAGE')}</Text>
    </DialogMessageInform>
  )

  const disableSaveButton = () => {
    return targetSites.length === 0 || !areConfigurationsFilled(configurations)
  }

  const showConfigurations = () => {
    return configurations.length ? (
      <div className={classes.selectConfigurationOuterDivStyle}>
        <div className={classes.selectConfigurationInnerDivStyle}>
          <Card
            header={
              <CardHeader
                titleText={t('COPY_CONFIGURATION_EXTENDED.SELECT_CONFIGURATION')}
                action={<CheckBox id="selectAllCheckbox" text={t('COPY_CONFIGURATION_EXTENDED.SELECT_ALL')} onChange={onSelectAllCheckboxChangeHandler} />}
              />
            }
          >
            <FlexBox alignItems="Stretch" direction="Column" justifyContent="Start" wrap="Wrap">
              {configurations.map((configuration) => (
                <ConfigurationTree key={configuration.id} {...configuration} />
              ))}
            </FlexBox>
          </Card>
        </div>
      </div>
    ) : (
      ''
    )
  }

  const showErrorList = () => {
    return errors.length ? (
      <div className={classes.errorListOuterDivStyle}>
        <div className={classes.errorListInnerDivStyle}>
          <Card id="errorListContainer">
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
    return (
      <List id="selectedTargetApiKeysList" mode="Delete" onItemDelete={onTarketApiKeyDeleteHandler}>
        {targetSites.map((targetSite) => (
          <CustomListItem key={targetSite.apiKey} className={classes.targetSitesListItem} data-apikey={targetSite.apiKey}>
            <FlexBox>
              <table>
                <tbody>
                  <tr>
                    <td>
                      <Label>{t('COPY_CONFIGURATION_EXTENDED.SITE_DOMAIN')}</Label>
                    </td>
                    <td>
                      <Text>{targetSite.baseDomain}</Text>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <Label>{t('COPY_CONFIGURATION_EXTENDED.API_KEY')}</Label>
                    </td>
                    <td>
                      <Text>{targetSite.apiKey}</Text>
                    </td>
                  </tr>
                  {targetSite.partnerName ? (
                    <tr>
                      <td>
                        <Label>{t('COPY_CONFIGURATION_EXTENDED.PARTNER')}</Label>
                      </td>
                      <td>
                        <Text>
                          {targetSite.partnerName} ({targetSite.partnerId})
                        </Text>
                      </td>
                    </tr>
                  ) : (
                    ''
                  )}
                </tbody>
              </table>
            </FlexBox>
            {targetSite.error ? <MessagePopoverButton message={targetSite.error} /> : ''}
          </CustomListItem>
        ))}
      </List>
    )
  }

  const onMessageStripCloseHandler = () => {
    dispatch(clearApiCardError())
  }

  const showMessageStripError = () => {
    return apiCardError ? (
      <MessageStrip id="messageStripError" design="Negative" onClose={onMessageStripCloseHandler}>
        {apiCardError.errorMessage}
      </MessageStrip>
    ) : (
      ''
    )
  }

  const showGetTargetInfoBusyIndicator = () => {
    return isTargetInfoLoading ? <BusyIndicator active delay="1" className={classes.busyIndicatorStyle} /> : ''
  }

  const onMouseOverHandler = (event) => {
    if (event.target.shadowRoot) {
      setTooltipTarget(event.target.shadowRoot.host.id)
      setIsMouseOverIcon(true)
    }
  }

  const onMouseOutHandler = () => {
    setIsMouseOverIcon(false)
  }

  const openPopover = () => {
    return isMouseOverIcon && tooltipTarget === `targetSiteTooltipIcon`
  }

  return (
    <>
      <Bar
        design="Header"
        startContent={
          <>
            <Title level={TitleLevel.H3} className={classes.titleStyle}>
              <span className={classes.titleSpanStyle}>{PAGE_TITLE}</span>
            </Title>
          </>
        }
      ></Bar>

      <div className={classes.outerDivStyle}>
        <div className={classes.headerOuterDivStyle}>
          <div className={classes.headerInnerDivStyle}>
            <FlexBox className={classes.headerTextFlexboxStyle}>
              <Text id="copyConfigExtendedHeaderText" className={classes.componentTextStyle}>
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
                              <Label id="currentSiteLabel">{t('COPY_CONFIGURATION_EXTENDED.SITE_DOMAIN')}</Label>
                            </td>
                            <td>
                              <Text id="currentSiteName">{currentSiteInformation.baseDomain}</Text>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <Label id="currentSiteApiKeyLabel">{t('COPY_CONFIGURATION_EXTENDED.API_KEY')}</Label>
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
                    <FlexBox justifyContent="SpaceBetween">
                      <Title level="H3" className={classes.targetInfoContainerTitle}>
                        {t('COPY_CONFIGURATION_EXTENDED.TO')}
                      </Title>
                      <Icon
                        id="targetSiteTooltipIcon"
                        name="information"
                        design="Information"
                        onMouseOver={onMouseOverHandler}
                        onMouseOut={onMouseOutHandler}
                        className={classes.tooltipIconStyle}
                      />
                      <Popover id="targetSitePopover" opener="targetSiteTooltipIcon" open={openPopover()}>
                        {t(`COPY_CONFIGURATION_EXTENDED.TARGET_SITES_TOOLTIP`)}
                      </Popover>
                    </FlexBox>

                    <Card>
                      <div className={classes.targetInfoContainerInputContainer}>
                        <Input
                          showSuggestions
                          id="targetApiKeyInput"
                          onInput={onTargetApiKeysInputHandler}
                          onKeyPress={onTargetApiKeysInputKeyPressHandler}
                          type={InputType.Text}
                          value={tarketApiKeyInputValue}
                          className={classes.targetInfoContainerInput}
                          onSuggestionItemSelect={onSuggestionItemSelectHandler}
                          placeholder={t('COPY_CONFIGURATION_EXTENDED.ENTER_API_KEY_OR_SITE_DOMAIN')}
                        >
                          {filteredAvailableTargetSites.map((availableTargetSite) => (
                            <SuggestionItem
                              key={availableTargetSite.apiKey}
                              // type="Navigation"
                              text={availableTargetSite.baseDomain}
                              additionalText={availableTargetSite.apiKey}
                              description={`${availableTargetSite.partnerName} (${availableTargetSite.partnerId})`}
                            />
                          ))}
                          <Button id="addTargetSiteButton" slot="icon" icon="add" onClick={onAddTargetSiteButtonClickHandler} design="Transparent"></Button>
                        </Input>

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
              {showBusyIndicator()}
            </Card>
          </div>
        </div>

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
                      id="saveButton"
                      className="fd-button fd-button--emphasized fd-button--compact"
                      onClick={onSaveHandler}
                      design="Emphasized"
                      disabled={disableSaveButton()}
                    >
                      {t('GLOBAL.SAVE')}
                    </Button>
                    <Button type="button" id="cancelButton" className="fd-button fd-button--transparent fd-button--compact" onClick={onCancelHandler}>
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
