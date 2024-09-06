/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */

const styles = {
  errorDialogStyle: {
    textAlign: 'left',
  },
  outerBarStyle: {
    width: 'auto',
    position: 'absolute',
    top: '5px',
    right: '30px',
    boxShadow: 'none',
    zIndex: 10,
    background: 'transparent',
    textAlign: 'left',
    marginRight: '16px !important',
  },
  innerBarStyle: {
    width: '300px',
    position: 'absolute',
    top: '5px',
    right: '1px',
    boxShadow: 'none',
    zIndex: 10,
    background: 'transparent',
    textAlign: 'left',
    marginLeft: '150px !important',
  },
  importAllButtonStyle: {
    composes: 'fd-button fd-button--compact',
    marginRight: '110px !important',
  },
  singlePrettifyButton: {
    composes: 'fd-button fd-button--compact',
    marginRight: '45px !important',
  },
  prettifyAllButtons: {
    composes: 'fd-button fd-button--compact',
    marginLeft: '50px !important',
  },
}

export default styles
