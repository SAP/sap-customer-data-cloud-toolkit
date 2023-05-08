import { useDispatch, useSelector } from 'react-redux'

import { Button, FlexBox } from '@ui5/webcomponents-react'

import {
  selectSitesConfigurations,
  removeSiteConfigurations,
  setSiteId,
  setEdit,
  setIsCopyConfigurationDialogOpen,
} from '../../redux/siteDeployerCopyConfiguration/siteDeployerCopyConfigurationSlice'

import '@ui5/webcomponents-icons/dist/add.js'
import '@ui5/webcomponents-icons/dist/edit.js'
import '@ui5/webcomponents-icons/dist/delete.js'

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
      <FlexBox id="sitesCopyConfigurationButtonPannelGrid" data-cy="sitesCopyConfigurationButtonPannelGrid" justifyContent="Start">
        {!hasConfig() ? (
          <Button id="addSiteConfigButton" data-cy="addSiteConfigButton" icon="add" design="Transparent" onClick={onAddConfigButtonClickHandler} />
        ) : (
          <>
            <Button id="editSiteConfigButton" data-cy="editSiteConfigButton" icon="edit" design="Transparent" onClick={onEditConfigButtonClickHandler} />
            <Button id="declineSiteConfigButton" data-cy="declineSiteConfigButton" icon="delete" design="Transparent" onClick={onRemoveConfigButtonClickHandler} />
          </>
        )}
      </FlexBox>
    </>
  )
}

export default SitesCopyConfigurationButtonPannel
