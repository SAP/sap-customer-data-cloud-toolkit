import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
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
  selectCredentials,
  selectSitesToDeleteManually,
} from '../../redux/siteSlice'

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
import { spacing } from '@ui5/webcomponents-react-base'
import '@ui5/webcomponents-icons/dist/navigation-down-arrow.js'
import '@ui5/webcomponents-icons/dist/navigation-right-arrow.js'
import '@ui5/webcomponents-icons/dist/add.js'
import '@ui5/webcomponents-icons/dist/decline.js'
import '@ui5/webcomponents-icons/dist/overflow.js'

import SitesTable from '../../components/sites-table/sites-table.component'
import MessageList from '../../components/message-list/message-list.component'
import DialogMessage from '../../components/dialog-message-dialog/dialog-message.component'
import CredentialsPopoverButton from '../../components/credentials-popover-button/credentials-popover-button.component'
import ManualRemovalPopup from '../../components/manual-removal-popup/manual-removal-popup.component'

import structures from '../../sitesStructures.json'

const BarStart = (props) => (
  <Title level={TitleLevel.H3} slot={props.slot} style={spacing.sapUiSmallMarginBegin}>
    <span style={spacing.sapUiTinyMarginBegin}>Site Deployer</span>
  </Title>
)

const getSelectedDataCenters = () => {
  const dataCenterHTMLCollection = document.getElementById('cdctools-dataCenter').children
  return [...dataCenterHTMLCollection].filter((item) => item._state.selected === true).map((item) => item._state.text)
}

const checkSitesExist = (sites) => {
  if (sites.length === 0) {
    return false
  }
  return true
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

const SiteDeployer = () => {
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
  const [showErrorDialog, setShowErrorDialog] = useState(false)

  const checkCredentialsAreFilled = () => {
    return credentials.userKey !== '' && credentials.userSecret !== ''
  }

  const onSaveHandler = () => {
    if (checkCredentialsAreFilled()) {
      setShowErrorDialog(false)
      dispatch(createSites(sites))
    } else {
      setShowErrorDialog(true)
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

  const showSaveCancelButtons = () => {
    return (
      <Bar
        design="FloatingFooter"
        endContent={
          <div>
            <Button disabled={checkSitesRequiredFields(sites)} type="submit" id="save-main" className="fd-button fd-button--emphasized fd-button--compact" onClick={onSaveHandler}>
              Save
            </Button>
            <Button disabled={!checkSitesExist(sites)} type="button" id="cancel-main" className="fd-button fd-button--transparent fd-button--compact" onClick={onCancelHandler}>
              Cancel
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
      <div style={spacing.sapUiSmallMargin}>
        <div style={spacing.sapUiTinyMargin}>
          <Card>
            <MessageList messages={messages} />
          </Card>
        </div>
      </div>
    )

  return (
    <>
      <Bar design="Header" startContent={<BarStart />} endContent={<CredentialsPopoverButton />}></Bar>
      <div className="cdc-tools-background" style={{ overflow: 'scroll', height: 'calc(100vh - 100px)' }}>
        <div style={spacing.sapUiSmallMargin}>
          <div style={spacing.sapUiTinyMargin}>
            <FlexBox style={spacing.sapUiSmallMarginBottom}>
              <Text style={{ color: 'var(--sapNeutralElementColor)' }}>
                Use Site Structures to quickly create complex implementations from a curated list of structures based on best practices.
              </Text>
            </FlexBox>
            <Card header={<CardHeader titleText="Site Structures" />}>
              <FlexBox justifyContent="SpaceBetween">
                <div
                  style={{
                    ...spacing.sapUiSmallMargin,
                    textAlign: 'left',
                    width: '100%',
                  }}
                >
                  <Label for="cdctools-siteDomain" style={{ ...spacing.sapUiTinyMarginTopBottom }}>
                    Site Domain: *
                  </Label>
                  <Input
                    id="cdctools-siteDomain"
                    type={InputType.Text}
                    style={{ width: '100%' }}
                    placeholder="e.g. mysite.com"
                    onInput={(event) => {
                      onBaseDomainChange(event)
                    }}
                  />
                </div>
                <div
                  style={{
                    ...spacing.sapUiSmallMargin,
                    textAlign: 'left',
                    width: '100%',
                  }}
                >
                  <Label for="cdctools-dataCenter" style={{ ...spacing.sapUiTinyMarginTopBottom }}>
                    Choose Data Centers: *
                  </Label>
                  <MultiComboBox id="cdctools-dataCenter" style={{ width: '100%' }} onSelectionChange={(event) => checkDataCentersSelected(event)}>
                    {dataCenters.map(({ label }) => (
                      <MultiComboBoxItem key={label} text={label} selected />
                    ))}
                  </MultiComboBox>
                </div>
              </FlexBox>

              <div
                style={{
                  ...spacing.sapUiSmallMargin,
                  marginTop: 0,
                  textAlign: 'left',
                }}
              >
                <Label for="cdctools-siteStructure" style={{ ...spacing.sapUiTinyMarginTopBottom }}>
                  Select a Site Structure: *
                </Label>

                <Select id="cdctools-siteStructure" style={{ width: '100%' }} onChange={onChangeSiteStructure} required="true">
                  <Option></Option>
                  {structures.map(({ _id, name }) => (
                    <Option key={_id} value={_id} data-value={_id}>
                      {name}
                    </Option>
                  ))}
                </Select>
              </div>
              <div style={{ textAlign: 'center' }}>
                <Bar design="Footer" style={{ display: 'block', position: 'relative', margin: '0 0px -3px 0' }}>
                  <Button
                    id="createButton"
                    disabled={checkRequiredFields()}
                    onClick={onCreateHandler}
                    icon="add"
                    design="Transparent"
                    style={{ display: 'block', position: 'absolute', left: 0, right: 0, margin: 0 }}
                  >
                    Create Structure
                  </Button>
                </Bar>
              </div>
            </Card>
          </div>
        </div>
        <div style={spacing.sapUiSmallMargin}>
          <div style={spacing.sapUiTinyMargin}>
            <Card
              header={
                <CardHeader
                  titleText="Site Creation Preview"
                  subtitleText="Quickly add or remove sites, change the structure, update the domains naming, description and select data centers."
                  // subtitleText="Quickly change the domains naming and structure. You can also set policies, and other configurations to be copied from an existing site seed."
                ></CardHeader>
              }
            >
              {isLoading ? <BusyIndicator active delay="1" style={{ width: '100%', padding: '100px 0' }} /> : <SitesTable />}
            </Card>
          </div>
        </div>

        {showErrorsList(errors)}

        <div style={spacing.sapUiSmallMargin}>
          <div style={spacing.sapUiTinyMargin}>
            <Card>{showSaveCancelButtons()}</Card>
          </div>
        </div>

        {showSuccessDialog ? (
          <DialogMessage
            open={showSuccessDialog}
            headerText="Success"
            state={ValueState.Success}
            closeButtonContent="Ok"
            onAfterClose={() => document.location.reload()}
            id="successPopup"
          >
            All sites have been created successfully
          </DialogMessage>
        ) : (
          ''
        )}

        <DialogMessage
          open={showErrorDialog}
          headerText="Error"
          state={ValueState.Error}
          closeButtonContent="Ok"
          onAfterClose={() => setShowErrorDialog(false)}
          style={{ textAlign: 'center' }}
          id="errorPopup"
        >
          Please insert User and Secret Keys <br />
          in the Credentials menu
        </DialogMessage>
        {sitesToDeleteManually.length ? <ManualRemovalPopup /> : ''}
      </div>
    </>
  )
}

export default SiteDeployer
