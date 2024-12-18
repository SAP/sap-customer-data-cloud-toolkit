import { spacing } from '@ui5/webcomponents-react-base'

const styles = {
  dataImportContainer: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    overflowY: 'auto',
    height: '100vh',
    padding: '10px',
    width: '100%',
  },
  importAccountsConfigurations: {
    flex: '1 1 auto',
    padding: '10px',
    borderRadius: '5px',
    marginTop: '-20px',
  },
  serverImportComponent: {
    flex: '1 1 auto',
    padding: '10px',
    borderRadius: '5px',
    marginTop: '-30px',
    ...spacing.sapUiLargeMarginBottom,
  },
}

export default styles
