import { useDispatch, useSelector } from 'react-redux'

import { Button, Grid } from '@ui5/webcomponents-react'

import {
  selectSitesConfigurations,
  removeSiteConfigurations,
  setSiteId,
  setEdit,
  setIsCopyConfigurationDialogOpen,
} from '../../redux/siteDeployerCopyConfiguration/siteDeployerCopyConfigurationSlice'

import '@ui5/webcomponents-icons/dist/add.js'
import '@ui5/webcomponents-icons/dist/edit.js'
import '@ui5/webcomponents-icons/dist/decline.js'

const SitesCopyConfigurationButtonPannel = ({ siteId }) => {
  const dispatch = useDispatch()

  const sitesConfigurations = useSelector(selectSitesConfigurations)

  const onAddConfigButtonClickHandler = () => {
    dispatch(setEdit(false))
    dispatch(setSiteId(siteId))
    dispatch(setIsCopyConfigurationDialogOpen(true))
  }

  const onEditConfigButtonClickHandler = () => {
    dispatch(setEdit(true))
    dispatch(setSiteId(siteId))
    dispatch(setIsCopyConfigurationDialogOpen(true))
  }

  const onRemoveConfigButtonClickHandler = () => {
    dispatch(removeSiteConfigurations(siteId))
  }

  const hasConfig = () => {
    return sitesConfigurations.filter((sitesConfiguration) => sitesConfiguration.siteId === siteId).length !== 0
  }

  return (
    <>
      <Grid id="sitesCopyConfigurationButtonPannelGrid">
        <Button id="addSiteConfigButton" icon="add" design="Transparent" disabled={hasConfig()} onClick={onAddConfigButtonClickHandler} />
        <Button id="editSiteConfigButton" icon="edit" design="Transparent" disabled={!hasConfig()} onClick={onEditConfigButtonClickHandler} />
        <Button id="declineSiteConfigButton" icon="decline" design="Transparent" disabled={!hasConfig()} onClick={onRemoveConfigButtonClickHandler} />
      </Grid>
    </>
  )
}

export default SitesCopyConfigurationButtonPannel
