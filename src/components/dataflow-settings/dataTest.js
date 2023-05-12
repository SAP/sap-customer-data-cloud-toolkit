/*
 * Copyright (c) 2023 SAP SE or an SAP affiliate company.
 * All rights reserved.
 *
 * This software is the confidential and proprietary information of SAP
 * ("Confidential Information"). You shall not disclose such Confidential
 * Information and shall use it only in accordance with the terms of the
 * license agreement you entered into with SAP.
 */

export const dataflowWithAllVariablesSet = {
  id: 'testDataflow1',
  name: 'testDataflow1',
  value: false,
  variables: [
    { variable: 'testDataflow1var1', value: 'test1' },
    { variable: 'testDataflow1var2', value: 'test2' },
  ],
}

export const dataflowWithSomeVariablesSet = {
  id: 'testDataflow1',
  name: 'testDataflow1',
  value: false,
  variables: [
    { variable: 'testDataflow1var1', value: 'test1' },
    { variable: 'testDataflow1var2', value: '' },
  ],
}

export const dataflowWithNoneVariablesSet = {
  id: 'testDataflow1',
  name: 'testDataflow1',
  value: false,
  variables: [
    { variable: 'testDataflow1var1', value: '' },
    { variable: 'testDataflow1var2', value: '' },
  ],
}
