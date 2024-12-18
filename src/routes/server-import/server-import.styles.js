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
  cardDiv: {
    ...spacing.sapUiSmallMargin,
  },
  headerTextFlexboxStyle: {
    ...spacing.sapUiSmallMargin,
  },
  gridContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gridTemplateRows: 'repeat(3,auto)',
    marginLeft: '10px',
    rowGap: '-10px',
  },
  gridItem: {
    height: '100px',
    padding: '5px',
    width: '95%',
  },
  tableCell: {
    height: '100px',
    padding: '10px',
    width: '50%',
    height: '100px',
  },

  outerDiv: {
    width: '100%',
    ...spacing.sapUiTinyMarginBottom,
    ...spacing.sapUiSmallMarginTop,
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
}

export default styles
