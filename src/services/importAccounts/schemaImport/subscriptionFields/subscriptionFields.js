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
