import { spacing } from '@ui5/webcomponents-react-base'

const styles = {
  formContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    ...spacing.sapUiSmallMarginTop,
    ...spacing.sapUiMediumMarginBegin,
  },
  outerDiv: {
    ...spacing.sapUiTinyMarginBottom,
    ...spacing.sapUiTinyMarginTop,
    ...spacing.sapUiSmallMarginBegin,
  },
  input: {
    paddingRight: '16px',
  },
  selectBox: {
    paddingRight: '16px',
    marginTop: '16px',
  },
  submitButton: {
    marginTop: '16px',
  },
}

export default styles
