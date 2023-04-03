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
  componentTextStyle: {
    color: 'var(--sapNeutralElementColor)',
    ...spacing.sapUiTinyMarginBegin,
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
  currentInfoContainer: {
    ...spacing.sapUiMediumMarginBegin,
    ...spacing.sapUiMediumMarginTop,
  },
  currentInfoContainerTitle: {
    ...spacing.sapUiSmallMarginBottom,
  },
  currentInfoContainerCard: {
    ...spacing.sapUiMediumMarginBottom,
  },
  currentInfoContainerCardTable: {
    ...spacing.sapUiContentPadding,
  },
  targetInfoContainer: {
    ...spacing.sapUiMediumMarginEnd,
    ...spacing.sapUiMediumMarginTop,
  },

  targetInfoContainerInputContainer: {
    ...spacing.sapUiContentPadding,
  },
  targetSitesListTitle: {
    ...spacing.sapUiSmallMarginTop,
  },
  targetSitesListContainer: {
    ...spacing.sapUiSmallMarginTop,
    ...spacing.sapUiMediumMarginBottom,
  },
  headerTextFlexboxStyle: {
    ...spacing.sapUiSmallMarginBottom,
  },
  iconContainer: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: '100%',
    ...spacing.sapUiSmallMarginTop,
  },
  iconContainerIcon: {
    height: '50px',
    width: '50px',
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
}

export default styles
