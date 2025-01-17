import { createUseStyles } from 'react-jss'
import { Label } from '@ui5/webcomponents-react'
import styles from './server-import-component.styles.js'

const CustomLabel = ({ name }) => {
  const useStyles = createUseStyles(styles, { name: 'Server Import' })
  const classes = useStyles()
  const parts = name.split('*')
  return (
    <Label>
      {parts[0]}
      {parts.length > 1 && <span className={classes.MandatoryFieldIcon}>*</span>}
      {parts[1]}
    </Label>
  )
}

export default CustomLabel
