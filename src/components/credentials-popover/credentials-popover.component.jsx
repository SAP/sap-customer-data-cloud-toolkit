import { useSelector, useDispatch } from 'react-redux'
import { setUserKey, setSecretKey, selectCredentials } from '../../redux/credentials/credentialsSlice'
import { withNamespaces } from 'react-i18next'

import { Form, FormItem, Input, InputType, Link, Label } from '@ui5/webcomponents-react'
import { spacing } from '@ui5/webcomponents-react-base'

import { VERSION } from '../../constants'

const CredentialsPopover = ({ t }) => {
  const dispatch = useDispatch()
  const { userKey, secretKey } = useSelector(selectCredentials)

  const onUserKeyValueChange = (event) => {
    const newUserKey = event.target.value
    dispatch(setUserKey(newUserKey))
  }

  const onsecretKeyValueChange = (event) => {
    const newSecretKey = event.target.value
    dispatch(setSecretKey(newSecretKey))
  }

  return (
    <>
      <FormItem label={t('GLOBAL.USER_KEY')}>
        <Input type={InputType.Text} id="userKey" value={userKey} onInput={(event) => onUserKeyValueChange(event)} />
      </FormItem>
      <FormItem label={t('GLOBAL.SECRET_KEY')}>
        <Input type={InputType.Password} id="secretKey" value={secretKey} onInput={(event) => onsecretKeyValueChange(event)} />
      </FormItem>

      <Form style={{ ...spacing.sapUiSmallMarginTop }} columnsS="2">
        <FormItem>
          <Link href="https://wiki.one.int.sap/wiki/display/CDCTOOLBOX/End+User+Documentation" target="_blank">
            {t('GLOBAL.DOCUMENTATION')}
          </Link>
        </FormItem>

        <FormItem>
          <Label style={{ width: '100%', textAlign: 'right' }}>
            <small>
              {t('GLOBAL.VERSION')} {VERSION}
            </small>
          </Label>
        </FormItem>
      </Form>
    </>
  )
}

export default withNamespaces()(CredentialsPopover)
