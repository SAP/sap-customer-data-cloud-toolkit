import { useDispatch, useSelector } from 'react-redux'
import { withTranslation } from 'react-i18next'
import { createUseStyles } from 'react-jss'

import { Title, FlexBox, Icon, Popover } from '@ui5/webcomponents-react'

import { setIsMouseOverIcon, selectIsMouseOverIcon } from '../../redux/targetSitesTooltipIcon/targetSitesTooltipIconSlice'

import styles from './target-sites-tooltip-icon.styles'
const useStyles = createUseStyles(styles, { name: 'TargetSitesTooltipIcon' })

const TargetSitesTooltipIcon = ({ title, t }) => {
  const classes = useStyles()
  const dispatch = useDispatch()

  const isMouseOverIcon = useSelector(selectIsMouseOverIcon)

  const onMouseOverHandler = (event) => {
    dispatch(setIsMouseOverIcon(true))
  }

  const onMouseOutHandler = () => {
    dispatch(setIsMouseOverIcon(false))
  }

  const openPopover = () => {
    return isMouseOverIcon
  }

  return (
    <FlexBox justifyContent="SpaceBetween">
      <Title level="H3" className={classes.targetInfoContainerTitle}>
        {title}
      </Title>
      <Icon
        id={`${title}targetSiteTooltipIcon`}
        data-cy="targetSiteTooltipIcon"
        name="information"
        design="Information"
        onMouseOver={onMouseOverHandler}
        onMouseOut={onMouseOutHandler}
        className={classes.tooltipIconStyle}
      />
      <Popover id={`${title}targetSitePopover`} data-cy="targetSitePopover" opener={`${title}targetSiteTooltipIcon`} open={openPopover()}>
        {t(`COPY_CONFIGURATION_EXTENDED.TARGET_SITES_TOOLTIP`)}
      </Popover>
    </FlexBox>
  )
}

export default withTranslation()(TargetSitesTooltipIcon)
