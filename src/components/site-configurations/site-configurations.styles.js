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
}

export default styles
