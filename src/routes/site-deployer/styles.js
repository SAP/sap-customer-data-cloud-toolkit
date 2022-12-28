import { spacing } from '@ui5/webcomponents-react-base'

const styles = {
  titleStyle: {
    ...spacing.sapUiSmallMarginBegin,
  },
  titleSpanStyle: {
    ...spacing.sapUiTinyMarginBegin,
  },
  componentTextStyle: {
    color: 'var(--sapNeutralElementColor)',
  },
  outerDivStyle: {
    composes: 'cdc-tools-background',
    overflow: 'scroll',
    height: 'calc(100vh - 100px)',
  },
  headerOuterDivStyle: {
    ...spacing.sapUiSmallMargin,
  },
  headerInnerDivStyle: {
    ...spacing.sapUiTinyMargin,
  },
  headerTextFlexboxStyle: {
    ...spacing.sapUiSmallMarginBottom,
  },
  cardFlexboxStyle: {
    ...spacing.sapUiSmallMargin,
    textAlign: 'left',
    width: '100%',
  },
  siteDomainLabelStyle: {
    ...spacing.sapUiTinyMarginTopBottom,
  },
  siteDomainInputStyle: {
    width: '100%',
  },
  dataCentersOuterDivStyle: {
    ...spacing.sapUiSmallMargin,
    textAlign: 'left',
    width: '100%',
  },
  dataCentersLabelStyle: {
    ...spacing.sapUiTinyMarginTopBottom,
  },
  dataCentersMultiComboBoxStyle: {
    width: '100%',
  },
  siteStructureOuterDivStyle: {
    ...spacing.sapUiSmallMargin,
    marginTop: 0,
    textAlign: 'left',
  },
  siteStructuresLabelStyle: {
    ...spacing.sapUiTinyMarginTopBottom,
  },
  siteStructureSelectStyle: {
    width: '100%',
  },
  siteCreationPreviewCardOuterDivStyle: {
    ...spacing.sapUiSmallMargin,
  },
  siteCreationPreviewCardInnerDivStyle: {
    ...spacing.sapUiTinyMargin,
  },
  saveCancelButtonsOuterDivStyle: { ...spacing.sapUiSmallMargin },
  saveCancelButtonsInnerDivStyle: { ...spacing.sapUiTinyMargin },
  createButtonOuterDivStyle: {
    textAlign: 'center',
  },
  createButtonBarStyle: {
    display: 'block',
    position: 'relative',
    margin: '0 0px -3px 0',
  },
  createButtonStyle: {
    display: 'block',
    position: 'absolute',
    left: 0,
    right: 0,
    margin: 0,
  },
  busyIndicatorStyle: {
    width: '100%',
    padding: '100px 0',
  },
  errorListOuterDivStyle: {
    ...spacing.sapUiSmallMargin,
  },
  errorListInnerDivStyle: {
    ...spacing.sapUiTinyMargin,
  },
}

export default styles
