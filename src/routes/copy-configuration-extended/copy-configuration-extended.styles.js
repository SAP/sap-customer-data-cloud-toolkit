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
    '--sapList_AlternatingBackground': 'white',
    '--sapList_SelectionBackgroundColor': 'white',
    '--ui5-listitem-selected-border-bottom': '0',
    '--ui5-listitem-border-bottom': '0',
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
  targetInfoContainerTitle: {
    ...spacing.sapUiSmallMarginBottom,
  },
  targetInfoContainerInputContainer: {
    ...spacing.sapUiContentPadding,
  },
  targetInfoContainerInput: {
    width: '100%',
  },
  targetSitesListTitle: {
    ...spacing.sapUiSmallMarginTop,
  },
  targetSitesListContainer: {
    ...spacing.sapUiSmallMarginTop,
    ...spacing.sapUiMediumMarginBottom,
  },
  targetSitesListItem: {
    ...spacing.sapUiContentPadding,
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
  tooltipIconStyle: {
    alignSelf: 'center',
    marginLeft: '6px',
  },
}

export default styles
