/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */

import { spacing } from '@ui5/webcomponents-react-base'

const styles = {
  formContainer: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    margin: '0 auto',
    padding: '20px',
    borderRadius: '4px',
    ...spacing.sapUiSmallMarginTop,
    ...spacing.sapUiMediumMarginBegin,
  },
  headerTextFlexboxStyle: {
    ...spacing.sapUiSmallMargin,
  },
  gridContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    marginLeft: '6px',
  },
  gridItem: {
    height: '70px',
    padding: '1px',
    width: '98%',
  },

  outerDiv: {
    width: '100%',
    ...spacing.sapUiTinyMarginBottom,
    ...spacing.sapUiSmallMarginTop,
  },
  cardDiv: {
    width: '100%',
  },

  createButtonBarStyle: {
    marginTop: '16px',
    display: 'flex',
    justifyContent: 'flex-end',
  },
  createButtonStyle: {
    marginLeft: '8px',
  },
  titleContainer: {
    ...spacing.sapUiMediumMarginBegin,
    ...spacing.sapUiMediumMarginTop,
  },
  outerDivContainer: {
    ...spacing.sapUiSmallMargin,
  },
  formOuterHeader: {
    display: 'flex',
    flexDirection: 'column',
  },
  smallTitle: {
    fontSize: '14px',
    fontWeight: 'bold',
    marginBottom: '4px',
    ...spacing.sapUiSmallMarginTop,
  },
  serverDropDown: {
    display: 'flex',
    flexDirection: 'column',
    ...spacing.sapUiSmallMargin,
  },
  outerDivFormItem: {
    width: '100%',
  },
  selectBox: {
    width: '100%',
    marginTop: '4px',
  },
  submitButton: {
    marginTop: '16px',
  },
  tooltipIconStyle: {
    alignSelf: 'center',
    marginLeft: '6px',
    color: 'black',
  },
  cardHeaderTitleText: {
    fontSize: '30px',
  },
  successMessage: {
    ...spacing.sapUiSmallMarginBegin,
    ...spacing.sapUiTinyMarginBottom,
  },
  warningMessage: {
    display: 'flex',
    alignItems: 'center',
    ...spacing.sapUiSmallMarginTop,
    marginLeft: '10px',
  },
  warningIcon: {
    ...spacing.sapUiTinyMarginEnd,
    marginBottom: '5px',
  },
  panelContainer: {
    width: '100%',
  },
  barStyle: {
    width: '100%',
  },
}

export default styles
