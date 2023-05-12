/*
 * Copyright (c) 2023 SAP SE or an SAP affiliate company.
 * All rights reserved.
 *
 * This software is the confidential and proprietary information of SAP
 * ("Confidential Information"). You shall not disclose such Confidential
 * Information and shall use it only in accordance with the terms of the
 * license agreement you entered into with SAP.
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
    marginLeft: '5px !important',
  },
}

export default styles
