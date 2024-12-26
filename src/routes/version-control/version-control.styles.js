import { FlexBoxJustifyContent } from '@ui5/webcomponents-react'

const styles = {
  innerBarStyle: {
    display: 'contents',
    flexDirection: 'column',
    alignItems: 'flex-start',
    padding: '10px',
    backgroundColor: '#fff', // Set background color to white
    height: 'auto', // Ensure the height adjusts to the content
    justifyContent: 'flex-start !important',
  },
  BarButton: {
    alignSelf: 'end !important', // Align the button to the right
  },
  singlePrettifyButton: {
    marginTop: '10px',
    alignSelf: 'flex-end', // Align the button to the right
    backgroundColor: '#0070f3', // Change as needed for styling
    color: '#fff',
    '&:hover': {
      backgroundColor: '#005bb5', // Change as needed for a hover effect
    },
  },
  commitsContainer: {
    padding: '20px',
    backgroundColor: '#fff', // Ensure the background color matches the table
  },
  commitTable: {
    width: '100%',
    borderCollapse: 'collapse',
    '& th, & td': {
      border: '1px solid #ddd', // Change border color as needed
      padding: '8px',
      textAlign: 'left',
    },
    '& th': {
      backgroundColor: '#f2f2f2', // Change for table header background
    },
    '& tr:nth-child(even)': {
      backgroundColor: '#f9f9f9', // Change for alternate row background
    },
    '& tr:hover': {
      backgroundColor: '#f1f1f1', // Change for row hover effect
    },
  },
  inputContainer: {
    display: 'flex',
    flexDirection: 'column',
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
  paginationContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '20px',
  },
  paginationButton: {
    margin: '0 5px',
    padding: '5px 10px',
    cursor: 'pointer',
    backgroundColor: '#0070f3',
    color: '#fff',
    border: 'none',
    borderRadius: '3px',
    '&:hover': {
      backgroundColor: '#005bb5',
    },
  },
  paginationPage: {
    margin: '0 5px',
    padding: '5px 10px',
    cursor: 'pointer',
    backgroundColor: '#fff',
    color: '#0070f3',
    border: '1px solid #0070f3',
    borderRadius: '3px',
    '&:hover': {
      backgroundColor: '#f1f1f1',
    },
  },
  paginationCurrentPage: {
    margin: '0 5px',
    padding: '5px 10px',
    cursor: 'default',
    backgroundColor: '#fff',
    color: '#0070f3',
    border: '1px solid #0070f3',
    borderRadius: '3px',
    fontWeight: 'bold',
  },
}

export default styles
