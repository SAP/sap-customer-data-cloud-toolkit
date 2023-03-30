import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Button, Grid } from '@ui5/webcomponents-react'

import { selectSitesConfigurations, removeSiteConfigurations } from '../../redux/siteDeployerCopyConfiguration/siteDeployerCopyConfigurationSlice'

import CopyConfigurationDialog from '../copy-configuration-dialog/copy-configuration-dialog.component'

import '@ui5/webcomponents-icons/dist/add.js'
import '@ui5/webcomponents-icons/dist/edit.js'
import '@ui5/webcomponents-icons/dist/decline.js'

const SitesCopyConfigurationButtonPannel = ({ siteId }) => {
  const dispatch = useDispatch()
  const sitesConfigurations = useSelector(selectSitesConfigurations)
  const [isCopyConfigurationDialogOpen, setIsCopyConfigurationDialogOpen] = useState(false)
  const [edit, setEdit] = useState(false)

  const onAddConfigButtonClickHandler = () => {
    setEdit(false)
    setIsCopyConfigurationDialogOpen(true)
  }

  const onEditConfigButtonClickHandler = () => {
    setEdit(true)
    setIsCopyConfigurationDialogOpen(true)
  }

  const onRemoveConfigButtonClickHandler = () => {
    dispatch(removeSiteConfigurations(siteId))
  }

  const onCopyConfigDialogAfterCloseHandler = () => {
    setIsCopyConfigurationDialogOpen(false)
  }

  const hasConfig = () => {
    return sitesConfigurations.filter((sitesConfiguration) => sitesConfiguration.siteId === siteId).length !== 0
  }

  const showCopyConfigDialog = () => {
    return (
      <CopyConfigurationDialog
        siteId={siteId}
        edit={edit}
        open={isCopyConfigurationDialogOpen}
        setIsCopyConfigurationDialogOpen={setIsCopyConfigurationDialogOpen}
        onAfterCloseHandler={onCopyConfigDialogAfterCloseHandler}
      />
    )
  }

  return (
    <>
      <Grid id="sitesCopyConfigurationButtonPannelGrid">
        <Button id="addSiteConfigButton" icon="add" design="Transparent" disabled={hasConfig()} onClick={onAddConfigButtonClickHandler} />
        <Button id="editSiteConfigButton" icon="edit" design="Transparent" disabled={!hasConfig()} onClick={onEditConfigButtonClickHandler} />
        <Button id="declineSiteConfigButton" icon="decline" design="Transparent" disabled={!hasConfig()} onClick={onRemoveConfigButtonClickHandler} />
      </Grid>
      {showCopyConfigDialog()}
    </>
  )
}

export default SitesCopyConfigurationButtonPannel
