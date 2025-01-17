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
  cardContainer: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  panelContainer: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  currentInfoContainerTitle: {
    marginBottom: '4px',
  },
  currentInfoContainer: {
    marginLeft: '53px',
    ...spacing.sapUiMediumMarginTop,
    display: 'flex',
    flexDirection: 'column',
  },
  cardHeaderStyle: {
    display: 'flex',
    ...spacing.sapUiTinyMarginBegin,
    alignSelf: 'flex-start',
  },
  fullContainer: {
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto',
    height: '90vh',
    composes: 'cdc-tools-background',
  },
  outerDivStyle: {
    composes: 'cdc-tools-background',
    ...spacing.sapUiSmallMargin,
    overflowY: 'auto', // Ensure it can scroll if needed
  },

  headerOuterDivStyle: {
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
