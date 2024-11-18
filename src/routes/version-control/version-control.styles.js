/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */

const styles = {
  innerBarStyle: {
    // your styles here
  },
  singlePrettifyButton: {
    // your styles here
  },
  commitsContainer: {
    marginTop: '20px',
    maxHeight: '900px', // Adjust height as needed
    overflowY: 'scroll',
  },
  commitTable: {
    width: '100%',
    borderCollapse: 'collapse',
    // Nested selectors for table header and data cells
    '& th': {
      border: '1px solid #ddd',
      padding: '8px',
      textAlign: 'left',
      backgroundColor: '#f2f2f2',
    },
    '& td': {
      border: '1px solid #ddd',
      padding: '8px',
      textAlign: 'left',
    },
  },
}

export default styles
