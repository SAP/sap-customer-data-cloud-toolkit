/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */


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
  inPopupTargetSitesListContainer: {
    ...spacing.sapUiSmallMarginTop,
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
    ...spacing.sapUiMediumMarginTopBottom,
  },
  inPopupBusyIndicatorStyle: {
    width: '100%',
    position: 'relative',
    ...spacing.sapUiSmallMarginTop,
  },
  targetApiKeyInputStyle: {
    width: '300px',
  },
  siteCopyConfigurationDialogStyle: {
    minWidth: '720px',
  },
  targetSitesTooltipIconDivStyle: {
    marginTop: '-35px',
  },
  selectConfigurationOuterDivStyle: {
    ...spacing.sapUiSmallMargin,
  },
  selectConfigurationInnerDivStyle: {
    ...spacing.sapUiTinyMargin,
  },
}

export default styles
