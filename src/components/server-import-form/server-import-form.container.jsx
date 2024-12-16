import React from 'react'
import { Label, Icon, Input, Popover } from '@ui5/webcomponents-react'
import { createUseStyles } from 'react-jss'
import styles from './server-import-component.styles.js'
import CustomLabel from './server-import-custom-label-component.jsx'

const FormItemWithIcon = ({ field, onMouseOverHandler, onMouseOutHandler, handleInputChange, openPopover }) => {
  const useStyles = createUseStyles(styles, { name: 'Server Import' })

  const classes = useStyles()
  return (
    <div>
      <div className={classes.labelIconContainer}>
        <CustomLabel name={field.name} />

        <Icon
          id={`${field.id}TooltipIcon`}
          name="message-information"
          design="Neutral"
          onMouseOver={onMouseOverHandler}
          onMouseOut={onMouseOutHandler}
          className={classes.tooltipIconStyle}
        />
        <Popover id={`${field.id}Popover`} opener={`${field.id}TooltipIcon`} open={openPopover(field.id)}>
          {field.tooltip}
        </Popover>
      </div>

      <Input
        type={field.type}
        name={field.name}
        placeholder={field.placeholder}
        value={field.value !== undefined ? field.value : ''}
        onInput={(event) => handleInputChange(event, field.id)}
      />
    </div>
  )
}

export default FormItemWithIcon
