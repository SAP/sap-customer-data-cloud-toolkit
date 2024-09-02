/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */

const styles = {
  errorDialogStyle: {
    textAlign: 'left',
  },
  outerBarStyle: {
    width: '300px',
    position: 'absolute',
    top: '5px',
    right: '30px',
    boxShadow: 'none',
    zIndex: 10,
    background: 'transparent',
  },
  importAllButtonStyle: {
    composes: 'fd-button fd-button--compact',
    marginRight: '110px !important',
  },
  smallActionSheet: {
    width: '200px',
    height: '200px',
    padding: '10px',
  },
}

export default styles
