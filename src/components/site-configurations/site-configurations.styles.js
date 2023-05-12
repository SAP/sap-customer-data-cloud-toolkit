/*
 * Copyright (c) 2023 SAP SE or an SAP affiliate company.
 * All rights reserved.
 *
 * This software is the confidential and proprietary information of SAP
 * ("Confidential Information"). You shall not disclose such Confidential
 * Information and shall use it only in accordance with the terms of the
 * license agreement you entered into with SAP.
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
}

export default styles
