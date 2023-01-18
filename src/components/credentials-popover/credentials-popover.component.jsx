import { useSelector, useDispatch } from 'react-redux'
import { withNamespaces } from 'react-i18next'
import { createUseStyles } from 'react-jss'
import { Form, FormItem, Input, InputType, Link, Label, MessageStrip, MessageStripDesign } from '@ui5/webcomponents-react'

import { setUserKey, setSecretKey, selectCredentials } from '../../redux/credentials/credentialsSlice'
import { selectIsNewReleaseAvailable, selectLatestReleaseVersion, selectLatestReleaseUrl } from '../../redux/version/versionSlice'

import { VERSION } from '../../constants'
import styles from './credentials-popover.styles.js'

const useStyles = createUseStyles(styles, { name: 'CredentialsPopover' })

const CredentialsPopover = ({ t }) => {
  const classes = useStyles()
  const dispatch = useDispatch()

  const { userKey, secretKey } = useSelector(selectCredentials)
  const isNewReleaseAvailable = useSelector(selectIsNewReleaseAvailable)
  const latestReleaseVersion = useSelector(selectLatestReleaseVersion)
  const latestReleaseUrl = useSelector(selectLatestReleaseUrl)

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

      <Form className={classes.documentationLinkStyle} columnsS="2">
        <FormItem>
          <Link href="https://wiki.one.int.sap/wiki/display/CDCTOOLBOX/End+User+Documentation" target="_blank">
            {t('GLOBAL.DOCUMENTATION')}
          </Link>
        </FormItem>

        <FormItem>
          <Label className={classes.versionLabelStyle}>
            <small>
              {t('GLOBAL.VERSION')} {VERSION}
            </small>
          </Label>
        </FormItem>
      </Form>
      {isNewReleaseAvailable ? (
        <FormItem>
          <MessageStrip design={MessageStripDesign.Warning} hideCloseButton={true}>
            {t('CREDENTIALS_POPOVER.NEW_VERSION')}
            <br />
            <Link href={latestReleaseUrl} target="_blank">
              {t('CREDENTIALS_POPOVER.DOWNLOAD_VERSION', { version: latestReleaseVersion })}
            </Link>
          </MessageStrip>
        </FormItem>
      ) : (
        ''
      )}
    </>
  )
}

export default withNamespaces()(CredentialsPopover)
