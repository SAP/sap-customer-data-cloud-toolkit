import React, { useState } from 'react'
import { Icon, Input, Popover } from '@ui5/webcomponents-react'
import { createUseStyles } from 'react-jss'
import styles from './server-import-component.styles.js'
import CustomLabel from './server-import-custom-label-component.jsx'

const FormItemWithIcon = ({ field, handleInputChange }) => {
  const useStyles = createUseStyles(styles, { name: 'Server Import' })
  const classes = useStyles()
  const [isMouseOverIcon, setIsMouseOverIcon] = useState(false)
  const [tooltipTarget, setTooltipTarget] = useState('')

  const onMouseOverHandler = (event) => {
    console.log('event', event)
    console.log('event-target', event.target.shadowRoot.host.id)
    console.log(`${event.target}TooltipIcon`)
    if (event.target.shadowRoot) {
      setTooltipTarget(event.target.shadowRoot.host.id)
      setIsMouseOverIcon(true)
    }
  }
  const onMouseOutHandler = () => {
    setIsMouseOverIcon(false)
  }

  const openPopover = (id) => {
    return isMouseOverIcon && tooltipTarget === `${id}TooltipIcon`
  }
  return (
    <div className={classes.outerDiv}>
      <div className={classes.labelIconContainer}>
        <CustomLabel name={field.name} />
        {field.tooltip && (
          <>
            <Icon
              id={`${field.id}TooltipIcon`}
              name="message-information"
              design="Neutral"
              onMouseOver={onMouseOverHandler}
              onMouseOut={onMouseOutHandler}
              className={classes.tooltipIconStyle}
            />
            <Popover className={classes.popoverStyle} id={`${field.id}Popover`} opener={`${field.id}TooltipIcon`} open={openPopover(field.id)} placementType="Right">
              {field.tooltip}
            </Popover>
          </>
        )}
      </div>

      <Input
        type={field.type}
        name={field.name}
        placeholder={field.placeholder}
        className={classes.inputStyle}
        value={field.value !== undefined ? field.value : ''}
        onInput={(event) => handleInputChange(event, field.id)}
      />
    </div>
  )
}

export default FormItemWithIcon
