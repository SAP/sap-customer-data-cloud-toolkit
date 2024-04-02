/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */


import { spacing } from '@ui5/webcomponents-react-base'

const styles = {
  selectConfigurationOuterDivStyle: {
    ...spacing.sapUiSmallMargin,
  },
  selectConfigurationInnerDivStyle: {
    ...spacing.sapUiTinyMargin,
    '--sapList_AlternatingBackground': 'white',
    '--sapList_SelectionBackgroundColor': 'white',
    '--ui5-listitem-selected-border-bottom': '0',
    '--ui5-listitem-border-bottom': '0',
  },

  removeIncludedUrlButton:{
    transform: 'translate(4px, 4px)',
  }
}

export default styles
