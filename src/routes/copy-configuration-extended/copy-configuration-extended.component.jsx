import { withTranslation } from 'react-i18next'
import { createUseStyles } from 'react-jss'
import { useEffect, useState } from 'react'

import { useDispatch, useSelector } from 'react-redux'

import { Card, CardHeader, Input, InputType, Label, Bar, Title, Text, TitleLevel, FlexBox, Button, ValueState, BusyIndicator } from '@ui5/webcomponents-react'

import { cleanTreeVerticalScrolls, areConfigurationsFilled } from './utils'

import ConfigurationTree from '../../components/configuration-tree/configuration-tree.component'
import DialogMessageInform from '../../components/dialog-message-inform/dialog-message-inform.component'

import { selectCredentials } from '../../redux/credentials/credentialsSlice'
import { areCredentialsFilled } from '../../redux/credentials/utils'

import { getApiKey } from '../../redux/utils'
import '@ui5/webcomponents-icons/dist/arrow-right.js'

import {
  selectConfigurations,
  getConfigurations,
  addTargetApiKey,
  setConfigurations,
  clearConfigurations,
  selectShowSuccessDialog,
  selectIsLoading,
  selectTargetApiKeys,
  clearTargetApiKeys,
  getCurrentSiteInformation,
  selectCurrentSiteInformation,
} from '../../redux/copyConfigurationExtendend/copyConfigurationExtendendSlice'

import './copy-configuration-extended.css'
import styles from './copy-configuration-extended.styles'

const useStyles = createUseStyles(styles, { name: 'CopyConfigurationExtended' })

const PAGE_TITLE = 'Copy Configuration Extended'

const CopyConfigurationExtended = ({ t }) => {
  const classes = useStyles()
  const dispatch = useDispatch()

  const [tarketApiKeyInputValue, setTarketApiKeyInputValue] = useState('')

  const showSuccessDialog = useSelector(selectShowSuccessDialog)
  const isLoading = useSelector(selectIsLoading)
  const targetApiKeys = useSelector(selectTargetApiKeys)
  const credentials = useSelector(selectCredentials)
  const configurations = useSelector(selectConfigurations)
  const currentSiteInformation = useSelector(selectCurrentSiteInformation)

  useEffect(() => {
    if (areCredentialsFilled(credentials)) {
      dispatch(getConfigurations())
      dispatch(getCurrentSiteInformation())

      cleanTreeVerticalScrolls()
    }
  }, [dispatch, credentials])

  const onSaveHandler = () => {
    dispatch(setConfigurations())
  }

  const onCancelHandler = () => {
    setTarketApiKeyInputValue('')
    dispatch(clearConfigurations())
    dispatch(clearTargetApiKeys())
  }
  const onTargetApiKeysInputChange = (event) => {
    setTarketApiKeyInputValue(event.target.value)
    dispatch(addTargetApiKey(event.target.value))
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

  const onSuccessDialogAfterCloseHandler = () => {
    // TODO
  }

  const disableSaveButton = () => {
    return targetApiKeys.length === 0 || !areConfigurationsFilled(configurations)
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
              <FlexBox className={classes.Container}>
                <FlexBox direction="Column" className={classes.currentInfoContainer}>
                  <FlexBox justifyContent="Start" className={classes.currentSiteFlexboxStyle}>
                    <Label id="currentSiteLabel" className="current_site">
                      {t('COPY_CONFIGURATION_EXTENDED.CURRENT_SITE')}
                    </Label>
                    <Text> {currentSiteInformation.baseDomain} </Text>
                  </FlexBox>
                  <FlexBox className={classes.currentApiKeyFlexboxStyle}>
                    <Label id="currentSiteApiKeyLabel">{t('COPY_CONFIGURATION_EXTENDED.CURRENT_SITE_API_KEY')}</Label>
                    <Text> {getApiKey(window.location.hash)} </Text>
                  </FlexBox>
                </FlexBox>
                <FlexBox justifyContent="Center" alignItems="Start" className={classes.iconContainer}>
                  <ui5-icon class={classes.iconStyle} name="arrow-right"></ui5-icon>
                </FlexBox>
                <FlexBox direction="Column" className={classes.targetInfoContainer}>
                  <FlexBox className={classes.destinationSiteFlexboxStyle}>
                    <Label id="destinationSiteLabel" className="current_site">
                      {t('COPY_CONFIGURATION_EXTENDED.DESTINATION_SITE')}
                    </Label>
                    <Text> {getApiKey(window.location.hash)} </Text>
                  </FlexBox>
                  <FlexBox className={classes.innerFlexBoxStyle}>
                    <Label id="targetSitesApisLabel">{t('COPY_CONFIGURATION_EXTENDED.TARGET_SITES_APIS')}</Label>
                    <Input id="targetApiKeyInput" onInput={onTargetApiKeysInputChange} type={InputType.Text} value={tarketApiKeyInputValue}></Input>
                  </FlexBox>
                </FlexBox>
              </FlexBox>
            </Card>
          </div>
        </div>

        {configurations.length !== 0 ? (
          <div className={classes.selectConfigurationOuterDivStyle}>
            <div className={classes.selectConfigurationInnerDivStyle}>
              <Card header={<CardHeader titleText={t('COPY_CONFIGURATION_EXTENDED.SELECT_CONFIGURATION')} />}>
                <FlexBox alignItems="Stretch" direction="Row" justifyContent="Start" wrap="Wrap">
                  {configurations.map((configuration) => (
                    <ConfigurationTree key={configuration.id} {...configuration} />
                  ))}
                </FlexBox>
              </Card>
            </div>
          </div>
        ) : (
          ''
        )}

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
      {isLoading ? <BusyIndicator active delay="1" className={classes.busyIndicatorStyle} /> : ''}
      {showSuccessMessage()}
    </>
  )
}

export default withTranslation()(CopyConfigurationExtended)
