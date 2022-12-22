import { Bar, Button } from '@ui5/webcomponents-react'
import { withNamespaces } from 'react-i18next'
import { createUseStyles } from 'react-jss'

import styles from './sms-templates.styles.js'

const useStyles = createUseStyles(styles, { name: 'SmsTemplates' })

const SmsTemplates = ({ t }) => {
  const classes = useStyles()

  return (
    <>
      <Bar
        className={classes.outerBarStyle}
        endContent={
          <div>
            <Button id="exportAllSmsTemplatesButton" className="fd-button fd-button--compact">
              {t('GLOBAL.EXPORT_ALL')}
            </Button>

            <Button id="importAllSmsTemplatesButton" className={classes.importAllButtonStyle}>
              {t('GLOBAL.IMPORT_ALL')}
            </Button>
          </div>
        }
      ></Bar>
    </>
  )
}

export default withNamespaces()(SmsTemplates)
