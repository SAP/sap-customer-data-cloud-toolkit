const styles = {
  innerBarStyle: {
    display: 'contents',
    flexDirection: 'column',
    alignItems: 'flex-start',
    padding: '10px',
    backgroundColor: '#fff',
    justifyContent: 'flex-start !important',
    marginBottom: '100px',
    height: '170px',
  },
  singlePrettifyButton: {
    marginTop: '10px',
    alignSelf: 'flex-end',
    backgroundColor: '#0070f3',
    color: '#fff',
    minWidth: 'fit-content',
    '&:hover': {
      backgroundColor: '#005bb5',
    },
  },
  tableContainer: {
    flexGrow: 1,
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    maxHeight: 'calc(100vh - 280px)',
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
}

export default styles
