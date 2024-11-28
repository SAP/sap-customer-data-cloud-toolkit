export const passwordObjectStructure = () => {
  const passwordStructure = [
    {
      id: 'password',
      name: 'password',
      value: false,
      branches: [
        { id: 'password.compoundHashedPassword', name: 'compoundHashedPassword', value: false, branches: [] },
        { id: 'password.hashedPassword', name: 'hashedPassword', value: false, branches: [] },

        {
          id: 'password.hashSettings',
          name: 'hashSettings',
          value: false,
          branches: [
            { id: 'password.hashSettings.algorithm', name: 'algorithm', value: false, branches: [] },
            { id: 'password.hashSettings.salt', name: 'salt', value: false, branches: [] },
            { id: 'password.hashSettings.rounds', name: 'rounds', value: false, branches: [] },
            { id: 'password.hashSettings.format', name: 'format', value: false, branches: [] },
            { id: 'password.hashSettings.binaryFormat', name: 'binaryFormat', value: false, branches: [] },
            { id: 'password.hashSettings.URL', name: 'URL', value: false, branches: [] },
          ],
        },
        {
          id: 'password.secretQuestionAndAnswer',
          name: 'secretQuestionAndAnswer',
          value: false,
          branches: [
            { id: 'password.secretQuestionAndAnswer.secretQuestion', name: 'secretQuestion', value: false, branches: [] },
            { id: 'password.secretQuestionAndAnswer.secretAnswer', name: 'secretAnswer', value: false, branches: [] },
          ],
        },
      ],
    },
  ]
  return passwordStructure
}

// [
//   {
//     id: 'data',
//     name: 'data',
//     value: true,
//     branches: [
//       { id: 'data.loyalty', name: 'data.loyalty', switchId : 'object',value: true, branches: [
//         { id: 'data.loyalty.rewardPoints', name: 'algorithm', value: true, switchId : 'object',branches: [] },
//         { id: 'data.loyalty.rewardRedemption', name: 'salt', value: true, branches: [        { id: 'data.loyalty.rewardRedemption.redemptionDate',switchId : 'array', name: 'rounds', value: true, branches: [] },
//         { id: 'data.loyalty.rewardRedemption.redemptionPoint', name: 'rounds',switchId : 'array', value: true, branches: [] },] },]},

//         { id: 'data.loyalty.rewardAmmount', name: 'format', value: true,switchId : 'object', branches: [] },
//         { id: 'data.loyalty.loyaltyStatus', name: 'rounds', value: true, switchId : 'object',branches: [] },
//         { id: 'data.loyalty.rewardAmmount', name: 'format', value: true, switchId : 'object',branches: [] },

//       ], },
//       { id: 'data.vehicle', name: 'data.vehicle', value: false, branches: [] },

//     ],
