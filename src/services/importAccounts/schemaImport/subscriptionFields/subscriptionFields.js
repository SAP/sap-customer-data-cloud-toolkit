/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */
export const subscriptionObjectStructure = (id) => {
  const subscriptionStructure = [
    { id: `${id}.isSubscribed`, name: `isSubscribed`, value: false, branches: [] },
    { id: `${id}.tags`, name: `tags`, value: false, branches: [] },
    {
      id: `${id}.lastUpdatedSubscriptionState`,
      name: 'lastUpdatedSubscriptionState',
      value: false,
      branches: [],
    },
    {
      id: `${id}.doubleOptIn`,
      name: 'doubleOptIn',
      value: false,
      branches: [
        {
          id: `${id}.doubleOptIn.isExternallyVerified`,
          name: 'isExternallyVerified',
          value: false,
          branches: [],
        },
      ],
    },
  ]
  return subscriptionStructure
}
