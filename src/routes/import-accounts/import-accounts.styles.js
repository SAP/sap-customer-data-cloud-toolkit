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
    fontSize: '0.875rem', // Adjust the size as needed
  },
  currentInfoContainerTitle: {
    ...spacing.sapUiSmallMarginBottom,
  },
  currentInfoContainer: {
    ...spacing.sapUiMediumMarginBegin,
    ...spacing.sapUiMediumMarginTop,
  },
  cardHeaderStyle: {
    ...spacing.sapUiSmallMarginTop,
    ...spacing.sapUiSmallMarginBegin,
  },
  outerDivStyle: {
    composes: 'cdc-tools-background',
    maxHeight: '80vh', // Adjust the height as needed
    overflow: 'auto',
  },
  headerOuterDivStyle: {
    width: '100%',
  },

  headerTextFlexboxStyle: {
    ...spacing.sapUiSmallMarginBottom,
  },
  searchBarGridItem: {
    position: 'relative',
    display: 'flex',
    justifyContent: 'flex-end',
    marginRight: '15px',
    marginTop: '22px',
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
    ...spacing.sapUiTinyMarginBegin,
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
