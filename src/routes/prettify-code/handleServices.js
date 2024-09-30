import PrettierFormatter from '../../services/prettierFormatter/prettierFormatter.js'
import { getScreenSet } from '../../redux/utils.js'
export const getServices = async ({
  credentialsUpdated,
  apikey,
  currentSiteInfo,
  setShowSuccess,
  setscreenSet,
  setShowInfo,
  setShowError,
  setErrorMessage,
  setModifiedScreenSets,
}) => {
  const prettier = new PrettierFormatter(credentialsUpdated, apikey, currentSiteInfo.dataCenter)
  const screenSet = getScreenSet(window.location)
  const { success, screenSetArray, error } = await prettier.formatScreenSets(apikey, screenSet)

  if (screenSetArray.length === 0 && error === null) {
    setscreenSet(screenSet)
    setShowSuccess(false)
    setShowInfo(true)
    return
  }
  if (error) {
    setErrorMessage(error)
    setShowSuccess(false)
    setShowError(true)
    return
  }
  if (success) {
    setShowSuccess(true)
    setModifiedScreenSets(screenSetArray)
  }
}
