const styles = {
  innerBarStyle: {
    display: 'flex',
    alignItems: 'center',
    padding: '10px',
    backgroundColor: '#f5f5f5', // Change as needed
    height: 'auto', // Ensure the height adjusts to the content
    '& input': {
      marginRight: '10px',
    },
  },
  singlePrettifyButton: {
    marginLeft: '10px',
    backgroundColor: '#0070f3', // Change as needed for styling
    color: '#fff',
    '&:hover': {
      backgroundColor: '#005bb5', // Change as needed for a hover effect
    },
  },
  commitsContainer: {
    padding: '20px',
    backgroundColor: '#fff', // Change as needed
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
    gap: '1rem',
  },
}

export default styles
