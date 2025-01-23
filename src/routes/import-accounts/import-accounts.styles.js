/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */
import { spacing } from '@ui5/webcomponents-react-base'

const styles = {
  errorDialogStyle: {
    textAlign: 'left',
  },
  titleSpanStyle: { fontSize: '24px' },
  pageTitleSpanStyle: {
    ...spacing.sapUiTinyMarginBegin,
  },
  titleStyle: {
    ...spacing.sapUiTinyMarginBottom,
    ...spacing.sapUiTinyMarginTop,
    marginLeft: '10px',
  },
  currentInfoContainerTitle: {
    ...spacing.sapUiSmallMarginBottom,
  },
  currentInfoContainer: {
    marginLeft: '53px',
    ...spacing.sapUiMediumMarginTop,
  },
  cardHeaderStyle: {
    display: 'flex',
    ...spacing.sapUiTinyMarginBegin,
    alignSelf: 'flex-start',
  },

  outerDivStyle: {
    composes: 'cdc-tools-background',
    maxHeight: '80vh',
    ...spacing.sapUiSmallMargin,
  },
  panelContainer: {
    width: '100%',
  },
  fullContainer: {
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto',
    height: '90vh',
    width: '100%',
    composes: 'cdc-tools-background',
  },
  headerOuterDivStyle: {
    ...spacing.sapUiSmallMarginBottom,
    width: '100%',
  },
  selectAccountDiv: {
    ...spacing.sapUiSmallMarginBottom,
  },
  headerTextFlexboxStyle: {
    ...spacing.sapUiTinyMarginBegin,
    ...spacing.sapUiTinyMarginTop,
    ...spacing.sapUiSmallMarginBottom,
    marginLeft: '15px',
  },

  searchBarGridItem: {
    position: 'relative',
    display: 'flex',
    justifyContent: 'flex-end',
    marginRight: '15px',
    marginTop: '16px',
  },
  configurationContainer: {
    marginTop: '20px',
  },
  searchBarContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'flex-end',

    ...spacing.sapUiLargeMarginTop,
    ...spacing.sapUiLargeMarginEnd,
  },
  componentTextStyle: {
    color: 'var(--sapNeutralElementColor)',
  },

  downloadTemplateButton: {
    composes: 'fd-button fd-button--compact',
    marginRight: '15px !important',
    boxSizing: 'border-box',
  },

  buttonContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    margin: '10px',
  },
}

export default styles
