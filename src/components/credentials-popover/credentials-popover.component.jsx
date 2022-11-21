// import { forwardRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setUserKey, setUserSecret, selectCredentials } from '../../redux/siteSlice'

import { Form, FormItem, Input, InputType, Link, Label } from '@ui5/webcomponents-react'
import { spacing } from '@ui5/webcomponents-react-base'

const CredentialsPopover = ({ userKey, userSecret }) => {
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
      <Form>
        <FormItem label="User key">
          <Input type={InputType.Text} id="userKey" value={userKey} onInput={(event) => onUserKeyValueChange(event)} />
        </FormItem>
        <FormItem label="Secret key">
          <Input type={InputType.Password} id="userSecret" value={userSecret} onInput={(event) => onUserSecretValueChange(event)} />
        </FormItem>
      </Form>

      <Form style={{ ...spacing.sapUiSmallMarginTop }} columnsS="2">
        <FormItem>
          <Link href="https://wiki.one.int.sap/wiki/display/CDCTOOLBOX/End+User+Documentation" target="_blank">
            Documentation
          </Link>
        </FormItem>

        <FormItem>
          <Label style={{ width: '100%', textAlign: 'right' }}>
            <small>Version 1.0.0</small>
          </Label>
        </FormItem>
      </Form>
    </>
  )
}

export default CredentialsPopover
