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
    width: '100%',
    marginTop: '16px',
  },
  createButtonStyle: {
    marginRight: 'auto', // Align to the right
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
}

export default styles
