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
  outerDiv: {
    width: '100%',
    ...spacing.sapUiTinyMarginBottom,
    ...spacing.sapUiSmallMarginTop,
  },
  createButtonBarStyle: {
    marginTop: '16px',
    display: 'flex',
    justifyContent: 'flex-end', // Push the buttons to the right
  },
  createButtonStyle: {
    marginLeft: '8px', // Add some space between buttons
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
}

export default styles
