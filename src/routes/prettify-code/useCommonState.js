import { useSelector } from 'react-redux'
import { useState } from 'react'
import { selectCredentials } from '../../redux/credentials/credentialsSlice.js'
import { getApiKey } from '../../redux/utils.js'
import { selectCurrentSiteInformation } from '../../redux/copyConfigurationExtended/copyConfigurationExtendedSlice.js'
import { trackUsage } from '../../lib/tracker.js'
const PAGE_TITLE = 'UI Builder'
export const useCommonState = () => {
  const [showSuccess, setShowSuccess] = useState(false)
  const [showError, setShowError] = useState(false)
  const [modifiedScreenSets, setModifiedScreenSets] = useState([])
  const [errorMessage, setErrorMessage] = useState('')
  const [showInfo, setShowInfo] = useState(false)
  const [screenSet, setscreenSet] = useState(false)
  const credentials = useSelector(selectCredentials)
  const apikey = getApiKey(window.location.hash)
  const currentSiteInfo = useSelector(selectCurrentSiteInformation)
  const credentialsUpdated = {
    userKey: credentials.userKey,
    secret: credentials.secretKey,
    gigyaConsole: credentials.gigyaConsole,
  }

  return {
    showSuccess,
    setShowSuccess,
    showError,
    setShowError,
    modifiedScreenSets,
    setModifiedScreenSets,
    errorMessage,
    setErrorMessage,
    showInfo,
    setShowInfo,
    screenSet,
    setscreenSet,
    apikey,
    currentSiteInfo,
    credentialsUpdated,
  }
}
export const onAfterCloseErrorDialogHandle = ({ setShowError }) => {
  setShowError(false)
}

export const onAfterCloseInformationDialogHandle = ({ setShowInfo }) => {
  setShowInfo(false)
}

export const onAfterCloseSuccessDialogHandle = async ({ setShowSuccess }) => {
  await trackUsage({ featureName: PAGE_TITLE })
  setShowSuccess(false)
  window.location.reload()
}
export default useCommonState
