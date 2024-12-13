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
    display: 'flex',
    justifyContent: 'flex-end', // Align items to the right
    width: '100%',
    marginTop: '16px',
  },
  selectConfigurationOuterDivStyle: {},
  createButtonStyle: {
    marginLeft: 'auto', // Push the button to the right
    marginTop: '10px',
  },
  titleContainer: {
    ...spacing.sapUiMediumMarginBegin,
  },
  selectBox: {
    width: 'calc(100% )',
    marginTop: '16px',
  },
  submitButton: {
    marginTop: '16px',
  },

  selectConfigurationInnerDivStyle: {
    ...spacing.sapUiTinyMargin,
  },
}

export default styles
