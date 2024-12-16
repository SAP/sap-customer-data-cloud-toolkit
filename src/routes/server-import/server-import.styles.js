import { spacing } from '@ui5/webcomponents-react-base'

const styles = {
  formContainer: {
    display: 'flex',
    flexDirection: 'column',
    width: '300px',
    margin: '0 auto',
    padding: '20px',
    borderRadius: '4px',
    ...spacing.sapUiSmallMarginTop,
    ...spacing.sapUiMediumMarginBegin,
  },
  outerDiv: {
    ...spacing.sapUiTinyMarginBottom,
    ...spacing.sapUiSmallMarginTop,
  },
  createButtonBarStyle: {
    marginTop: '16px',
  },
  createButtonStyle: {
    marginLeft: 'auto', // Push the button to the right
    marginTop: '10px',
  },
  titleContainer: {
    ...spacing.sapUiMediumMarginBegin,
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
    marginBottom: '8px',
    ...spacing.sapUiSmallMarginTop,
  },
  serverDropDown: {
    display: 'flex',
    flexDirection: 'column',
    ...spacing.sapUiSmallMargin,
  },
  selectBox: {
    width: '40%',
    marginTop: '16px',
  },
  submitButton: {
    marginTop: '16px',
  },

  selectConfigurationInnerDivStyle: {
    ...spacing.sapUiTinyMargin,
  },
  tooltipIconStyle: {
    alignSelf: 'center',
    marginLeft: '6px',
  },
}

export default styles
