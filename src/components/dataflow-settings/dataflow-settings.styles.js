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
  dataflowSettingsDialogStyle: {
    width: '35%',
  },
  variableLabelStyle: {
    ...spacing.sapUiTinyMargin,
  },
  inputStyle: {
    alignSelf: 'center',
    width: '100%',
    ...spacing.sapUiTinyMargin,
  },
}

export default styles