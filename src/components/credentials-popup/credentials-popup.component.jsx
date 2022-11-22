import { Input, InputType, Label } from '@ui5/webcomponents-react'
import { withNamespaces } from 'react-i18next'

import { useSelector, useDispatch } from 'react-redux'
import { setUserKey, setSecretKey, selectCredentials } from '../../redux/sites/siteSlice'

import './credentials-popup.component.css'

const CredentialsPopup = ({ t }) => {
  const dispatch = useDispatch()
  const credentials = useSelector(selectCredentials)

  const userKey = credentials.userKey
  const secretKey = credentials.secretKey
  const userKeyLabel = t('userKeyLabel')
  const secretKeyLabel = t('secretKeyLabel')

  const onUserKeyValueChange = (event) => {
    const newUserKey = event.target.value
    dispatch(setUserKey(newUserKey))
  }

  const onsecretKeyValueChange = (event) => {
    const newsecretKey = event.target.value
    dispatch(setSecretKey(newsecretKey))
  }

  return (
    <>
      <div className="popup-body">
        <div className="fd-bar fd-bar--header fd-dialog__header">
          <span aria-label="SAP" className="fd-shellbar__logo fd-shellbar__logo--image-replaced"></span>
          <h1 className="fd-title fd-title--h2" style={{ width: '100%', textAlign: 'center' }}>
            {t('appTitle')}
          </h1>
        </div>

        <div className="fd-dialog__body">
          <div className="fd-form-item">
            <Label className="fd-form-label__wrapper fd-form-label__wrapper--inline-help fd-form-label__wrapper--inline-help--after">
              <span className="fd-form-label">{userKeyLabel}:</span>
            </Label>
            <Input type={InputType.Text} id="userKey" placeholder={userKeyLabel} value={userKey} onInput={(event) => onUserKeyValueChange(event)} />
          </div>
          <div className="fd-form-item">
            <Label className="fd-form-label__wrapper fd-form-label__wrapper--inline-help fd-form-label__wrapper--inline-help--after">
              <span className="fd-form-label">{secretKeyLabel}:</span>
            </Label>
            <Input type={InputType.Password} id="secretKey" placeholder={secretKeyLabel} value={secretKey} onInput={(event) => onsecretKeyValueChange(event)} />
          </div>
        </div>
      </div>
    </>
  )
}

export default withNamespaces()(CredentialsPopup)
