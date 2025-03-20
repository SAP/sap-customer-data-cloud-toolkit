/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */
import { spacing } from '@ui5/webcomponents-react-base'
import { sapUiSmallMarginTop } from '@ui5/webcomponents-react-base/dist/styling/spacing.js'

const styles = {
  innerBarStyle: {
    display: 'contents',
    flexDirection: 'column',
    alignItems: 'flex-start',
    padding: '10px',
    backgroundColor: '#fff',
    justifyContent: 'flex-start !important',
    marginBottom: '100px',
    height: '120px',
    borderRadius: '2px 2px 10px 10px',
  },
  singlePrettifyButton: {
    height: '30px',
    backgroundColor: '#0070f3',
    color: '#fff',
    minWidth: 'fit-content', // Added min-width property
    '&:hover': {
      backgroundColor: '#005bb5',
    },
  },
  singlePrettifyRestoreButton: {
    height: '23px',
  },
  tableContainer: {
    flexGrow: 1,
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    ...sapUiSmallMarginTop,
    width: '100%',
    container: 'size', // or container: 'size'
  },
  commitTable: {
    width: '100%',
    borderCollapse: 'collapse',
    '& th, & td': {
      border: '1px solid #ddd',
      padding: '8px',
      textAlign: 'left',
    },
    '& th': {
      backgroundColor: '#f2f2f2',
    },
    '& tr:nth-child(even)': {
      backgroundColor: '#f9f9f9',
    },
    '& tr:hover': {
      backgroundColor: '#f1f1f1',
    },
  },
  inputContainer: {
    display: 'flex',
    flexDirection: 'row',
    gap: '1rem',
    width: '100%',
  },
  inputRow: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
  },
  inputField: {
    flex: '1',
    marginRight: '1rem',
    display: 'flex',
    flexDirection: 'column',
  },
  inputLabel: {
    marginBottom: '0.5rem',
  },
  fullHeightContainer: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    overflow: 'hidden',
  },
  descriptionText: {
    height: '40px',
    alignContent: 'center',
  },
  backupButtonBar: {
    alignContent: 'center',
    marginTop: '10px',
    borderRadius: '10px 10px 2px 2px',
    height: '70px',
  },
  restoreRowTitle: {
    marginRight: '3px',
  },

  restoreButton: {
    textAlign: 'right',
    paddingRight: '40px',
  },
  backupButton: {
    marginRight: '38px',
  },
  credentialsBlock: {
    borderRadius: '10px 10px 2px 2px',
  },
  fullContainer: {
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto',
    height: '90vh',
    width: '100%',
    composes: 'cdc-tools-background',
  },
  titleStyle: {
    ...spacing.sapUiTinyMarginBottom,
    ...spacing.sapUiTinyMarginTop,
    marginLeft: '10px',
  },
  titleSpanStyle: { fontSize: '24px' },
  pageTitleSpanStyle: {
    ...spacing.sapUiTinyMarginBegin,
  },
  headerOuterDivStyle3: {
    width: '100%',
    height: '50px',
  },
  outerDivStyle: {
    ...spacing.sapUiSmallMargin,
  },
  headerTextFlexboxStyle: {
    ...spacing.sapUiTinyMarginBegin,
    ...spacing.sapUiTinyMarginTop,
    ...spacing.sapUiSmallMarginBottom,
    marginLeft: '15px',
  },
  idCollumnStyle: {
    minWidth: '55px',
    width: 'fit-content',
  },
  dateCollumnStyle: {
    minWidth: '134px',
    width: 'fit-content',
  },
  messageCollumnStyle: {
    maxWidth: '300px',
    whiteSpace: 'nowrap',
    width: 'fit-content',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
  },
  noCommitsBar: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '50px',
    backgroundColor: '#f2f2f2',
    borderRadius: '4px',
    marginTop: '10px',
  },

  specifyFileLableStyle: {
    paddingBottom: '12px',
  },
  footerOuterDivStyle: {
    paddingTop: '12px',
    position: 'relative',
    left: 175,
  },
  headerOuterDivStyle2: {
    height: '35px',
    marginTop: '23px',
    fontSize: '15px',
  },
  currentInfoContainer: {
    display: 'inline-flex',
    ...spacing.sapUiSmallMarginBegin,
    ...spacing.sapUiMediumMarginBottom,
    ...spacing.sapUiSmallMarginTop,
  },
  cardTitle: {
    ...spacing.sapUiSmallMarginTop,
    ...spacing.sapUiSmallMarginBegin,
    width: '-webkit-fill-available',
    ...spacing.sapUiSmallMarginBottom,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  credentialsCardTitle: {
    ...spacing.sapUiSmallMarginTop,
    ...spacing.sapUiSmallMarginBegin,
    width: '-webkit-fill-available',
    marginBottom: 'var(--_ui5-v1-24-4_card_header_subtitle_margin_top)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  flexButton: {
    textAlign: 'end',
    float: 'inline-end',
  },
  versionListText: {
    fontWeight: 'bold !important',
  },
  commitMessagePopup: {
    borderRadius: 'var(--_ui5-v1-24-4_popup_border_radius)',
  },
  headerInnerDivStyle: {
    position: 'absolute',
    top: '30%',
  },
  credentialsCard: {
    marginBottom: '24px',
  },
  warningMessage: {
    marginTop: '32px',
    width: 'max-content',
    color: 'var( --sapErrorColor)',
  },
  filesToUpdate: {
    paddingBottom: '7px',
  },
  credentialsDescriptionStyle: {
    color: 'var(--sapContent_LabelColor)',
    fontFamily: 'var(--sapFontFamily)',
    fontSize: 'var(--sapFontSize)',
    fontWeight: 'var(--sapFontWeight)',
    marginLeft: '17px',
  },
  credentialsGridStyle: {
    ...spacing.sapUiSmallMarginTop,
  },

  okButtonStyle: {
    height: '30px',
    position: 'absolute',
    width: '69.28px',
  },
}

export default styles
