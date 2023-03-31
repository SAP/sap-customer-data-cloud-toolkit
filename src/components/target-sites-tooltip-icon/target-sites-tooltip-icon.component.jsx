import { useState } from 'react'
import { withTranslation } from 'react-i18next'
import { createUseStyles } from 'react-jss'

import { Title, FlexBox, Icon, Popover } from '@ui5/webcomponents-react'

import styles from './target-sites-tooltip-icon.styles'
const useStyles = createUseStyles(styles, { name: 'TargetSitesTooltipIcon' })

const TargetSitesTooltipIcon = ({ title, t }) => {
  const classes = useStyles()

  const [isMouseOverIcon, setIsMouseOverIcon] = useState(false)
  const [tooltipTarget, setTooltipTarget] = useState('')

  const onMouseOverHandler = (event) => {
    if (event.target.shadowRoot) {
      setTooltipTarget(event.target.shadowRoot.host.id)
      setIsMouseOverIcon(true)
    }
  }

  const onMouseOutHandler = () => {
    setIsMouseOverIcon(false)
  }

  const openPopover = () => {
    return isMouseOverIcon && tooltipTarget === `targetSiteTooltipIcon`
  }

  return (
    <FlexBox justifyContent="SpaceBetween">
      <Title level="H3" className={classes.targetInfoContainerTitle}>
        {title}
      </Title>
      <Icon
        id="targetSiteTooltipIcon"
        name="information"
        design="Information"
        onMouseOver={onMouseOverHandler}
        onMouseOut={onMouseOutHandler}
        className={classes.tooltipIconStyle}
      />
      <Popover id="targetSitePopover" opener="targetSiteTooltipIcon" open={openPopover()}>
        {t(`COPY_CONFIGURATION_EXTENDED.TARGET_SITES_TOOLTIP`)}
      </Popover>
    </FlexBox>
  )
}

export default withTranslation()(TargetSitesTooltipIcon)
