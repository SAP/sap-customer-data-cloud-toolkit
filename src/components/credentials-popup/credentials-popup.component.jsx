import { Input, InputType, Label } from '@ui5/webcomponents-react'

import { useSelector, useDispatch } from 'react-redux'
import { setUserKey, setUserSecret, selectCredentials } from '../../redux/siteSlice'

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
      <div className="fd-bar fd-bar--header fd-dialog__header">
        <span aria-label="SAP" className="fd-shellbar__logo fd-shellbar__logo--image-replaced"></span>
        <h1 className="fd-title fd-title--h2">CDC Tools</h1>
      </div>

      <div className="fd-dialog__body">
        <div className="fd-form-item">
          <Label className="fd-form-label__wrapper fd-form-label__wrapper--inline-help fd-form-label__wrapper--inline-help--after">
            <span className="fd-form-label">User key:</span>
          </Label>
          <Input
            type={InputType.Text}
            id="userKey"
            placeholder=""
            className="fd-input ng-pristine ng-invalid ng-touched"
            value={userKey}
            onInput={(event) => onUserKeyValueChange(event)}
          />
        </div>
        <div className="fd-form-item">
          <Label className="fd-form-label__wrapper fd-form-label__wrapper--inline-help fd-form-label__wrapper--inline-help--after">
            <span className="fd-form-label">Secret key:</span>
          </Label>
          <Input
            type={InputType.Password}
            id="secretKey"
            placeholder=""
            className="fd-input ng-pristine ng-invalid ng-touched"
            value={userSecret}
            onInput={(event) => onUserSecretValueChange(event)}
          />
        </div>
      </div>
    </>
  )
}

export default CredentialsPopup
