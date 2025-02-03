/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */
import { spacing } from '@ui5/webcomponents-react-base'

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
    minWidth: '-webkit-fit-content', // for Safari
    minWidth: 'fit-content', // Added min-width property
    '&:hover': {
      backgroundColor: '#005bb5',
    },
  },
  singlePrettifyRestoreButton: {
    height: '23px',
    backgroundColor: '#fff',
    color: '#0070f3',
    minWidth: '-webkit-fit-content', // for Safari
    minWidth: 'fit-content', // Added min-width property
    '&:hover': {
      backgroundColor: '#005bb5',
      color: '#fff',
    },
  },
  tableContainer: {
    flexGrow: 1,
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
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
    textAlign: 'rigth !important',
  },
  restoreButton: {
    textAlign: 'right',
    paddingRight: '40px',
  },
  backupButton: {
    marginRight: '30px',
  },
  credentialsBlock: {
    borderRadius: '10px 10px 2px 2px',
  },
  fullContainer: {
    overflowY: 'auto',
    width: '100%',
  },
  titleSpanStyle: { fontSize: '24px' },
  pageTitleSpanStyle: {
    ...spacing.sapUiTinyMarginBegin,
  },
  headerOuterDivStyle: {
    width: '100%',
  },
  outerDivStyle: {
    composes: 'cdc-tools-background',
    maxHeight: '80vh',
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
    width: 'fit-content',

    display: 'block' /* or inline-block */,
    textOverflow: 'ellipsis',
    wordWrap: 'break-word',
    overflow: 'hidden',
    maxHeight: '3.6em',
    lineHeight: '1.8em',
  },
  noCommitsBar: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '50px',
    backgroundColor: '#f2f2f2',
    borderRadius: '4px',
    marginTop: '10px',
  },
}

export default styles
