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
  Button,
  ValueState,
  BusyIndicator,
  List,
  CustomListItem,
  SuggestionItem,
  MessageStrip, Icon, Popover,
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
} from '../../redux/copyConfigurationExtended/copyConfigurationExtendedSlice'

import { selectCredentials } from '../../redux/credentials/credentialsSlice'

import { areCredentialsFilled } from '../../redux/credentials/utils'
import {
  cleanTreeVerticalScrolls,
  areConfigurationsFilled,
  filterTargetSites,
  getTargetSiteByTargetApiKey,
  extractTargetApiKeyFromTargetSiteListItem,
  findStringInAvailableTargetSites,
} from './utils'
import { getApiKey } from '../../redux/utils'

import { ROUTE_COPY_CONFIG_EXTENDED } from '../../inject/constants'

import '@ui5/webcomponents-icons/dist/arrow-right.js'
import '@ui5/webcomponents/dist/features/InputSuggestions.js'

import './copy-configuration-extended.css'
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

  window.onhashchange = () => {
    if (currentSiteApiKey !== getApiKey(window.location.hash) && window.location.hash.includes(ROUTE_COPY_CONFIG_EXTENDED)) {
      dispatch(updateCurrentSiteApiKey())
    }
  }

  useEffect(() => {
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
    console.log(inputValue)
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
    dispatch(removeTargetSite(extractTargetApiKeyFromTargetSiteListItem(event.detail.item.textContent)))
  }

  const onSuggestionItemSelectHandler = (event) => {
    const targetSite = getTargetSiteByTargetApiKey(event.detail.item.description, availableTargetSites)
    setTarketApiKeyInputValue('')
    dispatch(addTargetSite(targetSite))
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
          <Card header={<CardHeader titleText={t('COPY_CONFIGURATION_EXTENDED.SELECT_CONFIGURATION')} />}>
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
      <List id="selectedTargetApiKeysList" growing="Scroll" mode="Delete" indent onItemDelete={onTarketApiKeyDeleteHandler}>
        {targetSites.map((targetSite) => {
          console.log(targetSite)
          return (
            <CustomListItem key={targetSite.apiKey}>
              {targetSite.partnerName ? `${targetSite.baseDomain} - ${targetSite.apiKey} - ${targetSite.partnerName}` : `${targetSite.baseDomain} - ${targetSite.apiKey}`}
              {targetSite.error ? <MessagePopoverButton message={targetSite.error} /> : ''}
            </CustomListItem>
          )
        })}
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
  const [isMouseOverIcon, setIsMouseOverIcon] = useState(false)
  const [tooltipTarget, setTooltipTarget] = useState('')
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

            <Card header={<CardHeader titleText={t('COPY_CONFIGURATION_EXTENDED.APIS')} />}>
              <FlexBox className={classes.container}>
                <FlexBox direction="Column" className={classes.currentInfoContainer}>
                  <FlexBox justifyContent="Start" className={classes.currentSiteFlexboxStyle}>
                    <Label id="currentSiteLabel" className="current_site">
                      {t('COPY_CONFIGURATION_EXTENDED.CURRENT_SITE')}
                    </Label>
                    <Text id="currentSiteName"> {currentSiteInformation.baseDomain} </Text>
                  </FlexBox>

                  <FlexBox className={classes.currentApiKeyFlexboxStyle}>
                    <Label id="currentSiteApiKeyLabel">{t('COPY_CONFIGURATION_EXTENDED.CURRENT_SITE_API_KEY')}</Label>
                    <Text> {currentSiteApiKey} </Text>
                  </FlexBox>
                </FlexBox>

                <FlexBox justifyContent="Center" alignItems="Start" className={classes.iconContainer}>
                  <ui5-icon class={classes.iconStyle} name="arrow-right"></ui5-icon>
                </FlexBox>

                <FlexBox direction="Column" className={classes.targetInfoContainer}>
                  <FlexBox className={classes.innerFlexBoxStyle}>
                    <Label id="targetSitesApisLabel">{t('COPY_CONFIGURATION_EXTENDED.TARGET_SITES_APIS')}</Label>
                    <Icon
                        id="targetSiteTooltipIcon"
                        name="message-information"
                        design="Information"
                        onMouseOver={onMouseOverHandler}
                        onMouseOut={onMouseOutHandler}
                        className={classes.tooltipIconStyle}
                    />
                    <Popover id="targetSitePopover" opener="targetSiteTooltipIcon" open={openPopover()}>
                      {t(`COPY_CONFIGURATION_EXTENDED.TARGET_SITES_TOOLTIP`)}
                    </Popover>
                    <Input
                      showSuggestions
                      id="targetApiKeyInput"
                      onInput={onTargetApiKeysInputHandler}
                      onKeyPress={onTargetApiKeysInputKeyPressHandler}
                      type={InputType.Text}
                      value={tarketApiKeyInputValue}
                      className={classes.targetApiKeyInputStyle}
                      onSuggestionItemSelect={onSuggestionItemSelectHandler}
                    >
                      {filteredAvailableTargetSites.map((availableTargetSite) => (
                        <SuggestionItem
                          key={availableTargetSite.apiKey}
                          type="Navigation"
                          text={availableTargetSite.baseDomain}
                          description={availableTargetSite.apiKey}
                          additionalText={`${availableTargetSite.partnerName} (${availableTargetSite.partnerId})`}
                        />
                      ))}
                    </Input>
                    <Button id="addTargetSiteButton" onClick={onAddTargetSiteButtonClickHandler} design="Emphasized">
                      {t('GLOBAL.ADD')}
                    </Button>
                  </FlexBox>
                  {showGetTargetInfoBusyIndicator()}
                  {showMessageStripError()}
                  {showTargetApiKeys()}
                </FlexBox>
              </FlexBox>
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
