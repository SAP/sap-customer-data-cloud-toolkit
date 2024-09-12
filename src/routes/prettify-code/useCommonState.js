import { useSelector } from 'react-redux'
import { useState } from 'react'
import { selectCredentials } from '../../redux/credentials/credentialsSlice.js'
import { getApiKey } from '../../redux/utils.js'
import { selectCurrentSiteInformation } from '../../redux/copyConfigurationExtended/copyConfigurationExtendedSlice.js'

const useCommonState = () => {
  const [showSuccess, setShowSuccess] = useState(false)
  const [showError, setShowError] = useState(false)
  const [modifiedScreenSets, setModifiedScreenSets] = useState([])
  const [errorMessage, setErrorMessage] = useState('')

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
    apikey,
    currentSiteInfo,
    credentialsUpdated,
  }
}

export default useCommonState
