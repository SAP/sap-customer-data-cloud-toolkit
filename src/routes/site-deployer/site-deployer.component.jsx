import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { withNamespaces } from 'react-i18next'
import { createUseStyles } from 'react-jss'

import {
  Card,
  CardHeader,
  Input,
  InputType,
  Select,
  MultiComboBox,
  MultiComboBoxItem,
  Option,
  Label,
  Bar,
  Title,
  Text,
  TitleLevel,
  FlexBox,
  Button,
  BusyIndicator,
  ValueState,
} from '@ui5/webcomponents-react'
import '@ui5/webcomponents-icons/dist/navigation-down-arrow.js'
import '@ui5/webcomponents-icons/dist/navigation-right-arrow.js'
import '@ui5/webcomponents-icons/dist/add.js'
import '@ui5/webcomponents-icons/dist/decline.js'
import '@ui5/webcomponents-icons/dist/overflow.js'

import {
  addParentFromStructure,
  clearSites,
  clearErrors,
  createSites,
  selectSites,
  selectDataCenters,
  selectLoadingState,
  selectErrors,
  selectShowSuccessDialog,
  selectSitesToDeleteManually,
} from '../../redux/sites/siteSlice'

import { selectCredentials, updateCredentialsAsync, areCredentialsFilled } from '../../redux/credentials/credentialsSlice'

import SitesTable from '../../components/sites-table/sites-table.component'
import MessageList from '../../components/message-list/message-list.component'
import DialogMessage from '../../components/dialog-message-dialog/dialog-message.component'
import ManualRemovalPopup from '../../components/manual-removal-popup/manual-removal-popup.component'
import CredentialsErrorDialog from '../../components/credentials-error-dialog/credentials-error-dialog.component'

import structures from '../../sitesStructures.json'

import styles from './styles.js'

const useStyles = createUseStyles(styles, { name: 'SiteDeployer' })

const getSelectedDataCenters = () => {
  const dataCenterHTMLCollection = document.getElementById('cdctools-dataCenter').children
  return [...dataCenterHTMLCollection].filter((item) => item._state.selected === true).map((item) => item._state.text)
}

const checkSitesExist = (sites) => {
  return sites.length !== 0
}

const checkSitesRequiredFields = (sites) => {
  let requiredFieldsExist = true
  if (!checkSitesExist(sites)) {
    return true
  }

  sites.forEach((site) => {
    if (site.baseDomain === '' || site.dataCenter === '') {
      requiredFieldsExist = false
    }
    if (site.childSites) {
      site.childSites.forEach((childSite) => {
        if (childSite.baseDomain === '') {
          requiredFieldsExist = false
        }
      })
    }
  })
  return !requiredFieldsExist
}

const SiteDeployer = ({ t }) => {
  const dispatch = useDispatch()

  const sites = useSelector(selectSites)
  const isLoading = useSelector(selectLoadingState)
  const dataCenters = useSelector(selectDataCenters)
  const errors = useSelector(selectErrors)
  const showSuccessDialog = useSelector(selectShowSuccessDialog)
  const credentials = useSelector(selectCredentials)
  const sitesToDeleteManually = useSelector(selectSitesToDeleteManually)

  const [selectedStructureId, setSelectedStructureId] = useState()
  const [baseDomain, setBaseDomain] = useState('')
  const [areDataCentersSelected, setDataCentersSelected] = useState(true)
  const [showCredentialsErrorDialog, setShowCredentialsErrorDialog] = useState(false)

  const classes = useStyles()

  useEffect(() => {
    dispatch(updateCredentialsAsync())
  })

  const onSaveHandler = () => {
    if (areCredentialsFilled(credentials)) {
      setShowCredentialsErrorDialog(false)
      dispatch(createSites(sites))
    } else {
      setShowCredentialsErrorDialog(true)
    }
  }

  const onCancelHandler = () => {
    dispatch(clearSites())
    dispatch(clearErrors())
  }

  const onChangeSiteStructure = (event) => {
    setSelectedStructureId(event.detail.selectedOption.dataset.value)
  }

  const onCreateHandler = () => {
    const selectedDataCenters = getSelectedDataCenters()
    const selectedStructure = getSelectedStructure()

    dispatch(clearSites())
    selectedDataCenters.forEach((dataCenter) => {
      selectedStructure.data.forEach((structure) => {
        dispatch(
          addParentFromStructure({
            rootBaseDomain: baseDomain,
            baseDomain: structure.baseDomain,
            description: structure.description,
            dataCenter: dataCenter,
            childSites: structure.childSites,
          })
        )
      })
    })
  }

  const checkDataCentersSelected = (event) => {
    if (event.detail.items.length) {
      setDataCentersSelected(true)
    } else {
      setDataCentersSelected(false)
    }
  }

  const getSelectedStructure = () => {
    return structures.filter((siteStructure) => siteStructure._id === selectedStructureId)[0]
  }

  const onBaseDomainChange = (event) => {
    setBaseDomain(event.target.value)
  }

  const onAfterCloseCredentialsErrorDialogHandle = () => {
    setShowCredentialsErrorDialog(false)
  }

  const showSaveCancelButtons = () => {
    return (
      <Bar
        design="FloatingFooter"
        endContent={
          <div>
            <Button disabled={checkSitesRequiredFields(sites)} type="submit" id="save-main" className="fd-button fd-button--emphasized fd-button--compact" onClick={onSaveHandler}>
              {t('SITE_DEPLOYER_COMPONENT.SAVE')}
            </Button>
            <Button disabled={!checkSitesExist(sites)} type="button" id="cancel-main" className="fd-button fd-button--transparent fd-button--compact" onClick={onCancelHandler}>
              {t('GLOBAL.CANCEL')}
            </Button>
          </div>
        }
      ></Bar>
    )
  }

  const checkRequiredFields = () => {
    return !(baseDomain !== '' && selectedStructureId !== undefined && areDataCentersSelected)
  }

  const showErrorsList = (messages) =>
    !messages.length ? (
      ''
    ) : (
      <div className={classes.errorListOuterDivStyle}>
        <div className={classes.errorListInnerDivStyle}>
          <Card>
            <MessageList messages={messages} />
          </Card>
        </div>
      </div>
    )

  return (
    <>
      <Bar
        design="Header"
        startContent={
          <Title level={TitleLevel.H3} className={classes.titleStyle}>
            <span className={classes.titleSpanStyle}>Site Deployer</span>
          </Title>
        }
      ></Bar>
      <div className={classes.outerDivStyle}>
        <div className={classes.headerOuterDivStyle}>
          <div className={classes.headerInnerDivStyle}>
            <FlexBox className={classes.headerTextFlexboxStyle}>
              <Text className={classes.componentTextStyle}>{t('SITE_DEPLOYER_COMPONENT.TEXT')}</Text>
            </FlexBox>
            <Card header={<CardHeader titleText={t('SITE_DEPLOYER_COMPONENT.SITE_STRUCTURES')} />}>
              <FlexBox justifyContent="SpaceBetween">
                <div className={classes.cardFlexboxStyle}>
                  <Label for="cdctools-siteDomain" className={classes.siteDomainLabelStyle}>
                    {t('SITE_DEPLOYER_COMPONENT.SITE_DOMAIN')}
                  </Label>
                  <Input
                    id="cdctools-siteDomain"
                    type={InputType.Text}
                    className={classes.siteDomainInputStyle}
                    placeholder="e.g. mysite.com"
                    onInput={(event) => {
                      onBaseDomainChange(event)
                    }}
                  />
                </div>
                <div className={classes.dataCentersOuterDivStyle}>
                  <Label for="cdctools-dataCenter" className={classes.dataCentersLabelStyle}>
                    {t('SITE_DEPLOYER_COMPONENT.CHOOSE_DATA_CENTER')}
                  </Label>
                  <MultiComboBox id="cdctools-dataCenter" className={classes.dataCentersMultiComboBoxStyle} onSelectionChange={(event) => checkDataCentersSelected(event)}>
                    {dataCenters.map(({ label }) => (
                      <MultiComboBoxItem key={label} text={label} selected />
                    ))}
                  </MultiComboBox>
                </div>
              </FlexBox>

              <div className={classes.siteStructureOuterDivStyle}>
                <Label for="cdctools-siteStructure" className={classes.siteStructuresLabelStyle}>
                  {t('SITE_DEPLOYER_COMPONENT.SELECT_SITE_STRUCTURE')}
                </Label>

                <Select id="cdctools-siteStructure" className={classes.siteStructureSelectStyle} onChange={onChangeSiteStructure} required="true">
                  <Option></Option>
                  {structures.map(({ _id, name }) => (
                    <Option key={_id} value={_id} data-value={_id}>
                      {name}
                    </Option>
                  ))}
                </Select>
              </div>
              <div className={classes.createButtonOuterDivStyle}>
                <Bar design="Footer" className={classes.createButtonBarStyle}>
                  <Button id="createButton" disabled={checkRequiredFields()} onClick={onCreateHandler} icon="add" design="Transparent" className={classes.createButtonStyle}>
                    {t('SITE_DEPLOYER_COMPONENT.CREATE_STRUCTURE')}
                  </Button>
                </Bar>
              </div>
            </Card>
          </div>
        </div>
        <div className={classes.siteCreationPreviewCardOuterDivStyle}>
          <div className={classes.siteCreationPreviewCardInnerDivStyle}>
            <Card header={<CardHeader titleText={t('SITE_DEPLOYER_COMPONENT.SITE_CREATION_PREVIEW')} subtitleText={t('SITE_DEPLOYER_COMPONENT.ADD_OR_REMOVE_SITES')}></CardHeader>}>
              {isLoading ? <BusyIndicator active delay="1" className={classes.busyIndicatorStyle} /> : <SitesTable />}
            </Card>
          </div>
        </div>

        {showErrorsList(errors)}

        <div className={classes.saveCancelButtonsOuterDivStyle}>
          <div className={classes.saveCancelButtonsInnerDivStyle}>
            <Card>{showSaveCancelButtons()}</Card>
          </div>
        </div>

        {showSuccessDialog ? (
          <DialogMessage
            open={showSuccessDialog}
            headerText={t('GLOBAL.SUCCESS')}
            state={ValueState.Success}
            closeButtonContent="Ok"
            onAfterClose={() => document.location.reload()}
            id="successPopup"
          >
            {t('SITE_DEPLOYER_COMPONENT.SITES_CREATED_SUCCESSFULLY')}
          </DialogMessage>
        ) : (
          ''
        )}

        <CredentialsErrorDialog open={showCredentialsErrorDialog} onAfterCloseHandle={onAfterCloseCredentialsErrorDialogHandle} />

        {sitesToDeleteManually.length ? <ManualRemovalPopup /> : ''}
      </div>
    </>
  )
}

export default withNamespaces()(SiteDeployer)
