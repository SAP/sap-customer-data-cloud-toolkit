/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
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
