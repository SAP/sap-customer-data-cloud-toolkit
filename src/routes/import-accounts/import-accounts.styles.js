/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */
import { spacing } from '@ui5/webcomponents-react-base'
const styles = {
  errorDialogStyle: {
    textAlign: 'left',
  },
  titleSpanStyle: {
    ...spacing.sapUiTinyMarginBegin,
  },
  titleStyle: {
    ...spacing.sapUiTinyMarginBottom,
    ...spacing.sapUiTinyMarginTop,
    ...spacing.sapUiSmallMarginBegin,
  },
  currentInfoContainerTitle: {
    ...spacing.sapUiSmallMarginBottom,
  },
  currentInfoContainer: {
    ...spacing.sapUiMediumMarginBegin,
    ...spacing.sapUiMediumMarginTop,
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
  componentTextStyle: {
    color: 'var(--sapNeutralElementColor)',
    ...spacing.sapUiTinyMarginBegin,
  },
  innerBarStyle: {
    width: '300px',
    position: 'absolute',
    top: '5px',
    right: '1px',
    boxShadow: 'none',
    zIndex: 10,
    background: 'transparent',
    textAlign: 'left',
    marginLeft: '150px !important',
  },
  downloadTemplateButton: {
    composes: 'fd-button fd-button--compact',
    marginRight: '45px !important',
    ...spacing.sapUiMediumMarginBegin,
    ...spacing.sapUiMediumMarginTop,
    boxSizing: 'border-box',
  },
  customSwitch: {
    width: '500px',
    height: '40px',
    padding: '0 10px',
    cursor: 'pointer',
    fontSize: '16px',
    margin: '10px',
  },
}

export default styles
