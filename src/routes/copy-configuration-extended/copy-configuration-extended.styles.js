import { spacing } from '@ui5/webcomponents-react-base'

const styles = {
  titleSpanStyle: {
    ...spacing.sapUiTinyMarginBegin,
  },
  titleStyle: {
    ...spacing.sapUiTinyMarginBottom,
    ...spacing.sapUiTinyMarginTop,
    ...spacing.sapUiSmallMarginBegin,
  },

  outerDivStyle: {
    composes: 'cdc-tools-background',
    overflow: 'scroll',
    height: 'calc(100vh - 100px)',
  },
  headerDiv: {
    ...spacing.sapUiSmallMarginBegin,
    ...spacing.sapUiMediumMarginTop,
    ...spacing.sapUiSmallMarginBottom,
  },
  headerOuterDivStyle: {
    ...spacing.sapUiSmallMargin,
  },
  headerInnerDivStyle: {
    ...spacing.sapUiTinyMargin,
  },
  selectConfigurationOuterDivStyle: {
    ...spacing.sapUiSmallMargin,
  },
  selectConfigurationInnerDivStyle: {
    ...spacing.sapUiTinyMargin,
  },

  componentTextStyle: {
    color: 'var(--sapNeutralElementColor)',
    ...spacing.sapUiTinyMarginBegin,
  },
  innerFlexBoxStyle: {
    ...spacing.sapUiSmallMarginBegin,

    ...spacing.sapUiSmallMarginBottom,
    ...spacing.sapUiSmallMarginEnd,

    lineHeight: '30px',
  },
  apiKeyFlexBoxStyle: {
    gap: '10px',
    ...spacing.sapUiSmallMarginBegin,
    ...spacing.sapUiSmallMarginTop,
    ...spacing.sapUiSmallMarginBottom,
  },
  targetApiKeyFlexBoxStyle: {
    marginLeft: '300px',
  },
  container: {
    height: '100 %',
    width: '100%',
  },
  currentInfoContainer: {
    height: '250px',
    width: '45%',
    ...spacing.sapUiMediumMarginBegin,
    ...spacing.sapUiMediumMarginTop,
    ...spacing.sapUiSmallMargin,
  },
  currentSiteFlexboxStyle: {
    ...spacing.sapUiSmallMarginTop,
    gap: '30px',
  },
  currentApiKeyFlexboxStyle: {
    ...spacing.sapUiTinyMarginTop,
    gap: '62px',
  },
  targetInfoContainer: {
    width: '50%',
    height: '150px',
    ...spacing.sapUiMediumMarginTop,
    ...spacing.sapUiSmallMarginBegin,
  },
  destinationSiteFlexboxStyle: {
    ...spacing.sapUiSmallMarginTop,
    ...spacing.sapUiSmallMarginBegin,
    gap: '25px',
  },
  headerTextFlexboxStyle: {
    ...spacing.sapUiSmallMarginBottom,
  },
  iconContainer: {
    width: '10%',
    ...spacing.sapUiLargeMarginTop,
    ...spacing.sapUiLargeMarginEnd,
  },
  iconStyle: {
    height: '30px',
    width: '30px',
  },
  errorListOuterDivStyle: {
    ...spacing.sapUiSmallMargin,
  },
  errorListInnerDivStyle: {
    ...spacing.sapUiTinyMargin,
  },
  busyIndicatorStyle: {
    width: '100%',
    position: 'relative',
  },
  targetApiKeyInputStyle: {
    width: '300px',
  },
  tooltipIconStyle: {
    alignSelf: 'center',
    marginLeft: '6px',
  },
}

export default styles
