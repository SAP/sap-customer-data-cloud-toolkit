import { Input, InputType, Label } from '@ui5/webcomponents-react'

import { useSelector, useDispatch } from 'react-redux'
import { setUserKey, setUserSecret, selectCredentials } from '../../redux/siteSlice'

import './credentials-popup.component.css'

const CredentialsPopup = ({ userKey, userSecret }) => {
  const dispatch = useDispatch()
  const credentials = useSelector(selectCredentials)
  userKey = credentials.userKey
  userSecret = credentials.userSecret

  const onUserKeyValueChange = (event) => {
    const newUserKey = event.target.value
    dispatch(setUserKey(newUserKey))
  }

  const onUserSecretValueChange = (event) => {
    const newUserSecret = event.target.value
    dispatch(setUserSecret(newUserSecret))
  }

  return (
    <>
      <div className="popup-body">
        <div className="fd-bar fd-bar--header fd-dialog__header">
          <span aria-label="SAP" className="fd-shellbar__logo fd-shellbar__logo--image-replaced"></span>
          <h1 className="fd-title fd-title--h2" style={{ width: '100%', textAlign: 'center' }}>
            CDC Tools
          </h1>
        </div>

        <div className="fd-dialog__body">
          <div className="fd-form-item">
            <Label className="fd-form-label__wrapper fd-form-label__wrapper--inline-help fd-form-label__wrapper--inline-help--after">
              <span className="fd-form-label">User Key:</span>
            </Label>
            <Input type={InputType.Text} id="userKey" placeholder="User Key" value={userKey} onInput={(event) => onUserKeyValueChange(event)} />
          </div>
          <div className="fd-form-item">
            <Label className="fd-form-label__wrapper fd-form-label__wrapper--inline-help fd-form-label__wrapper--inline-help--after">
              <span className="fd-form-label">Secret Key:</span>
            </Label>
            <Input type={InputType.Password} id="userSecret" placeholder="Secret Key" value={userSecret} onInput={(event) => onUserSecretValueChange(event)} />
          </div>
        </div>
      </div>
    </>
  )
}

export default CredentialsPopup
