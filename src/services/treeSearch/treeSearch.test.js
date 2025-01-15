/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */

import TreeSearch from './treeSearch'
import { dataBranches, subscriptionsBranches } from '../importAccounts/mainDataSet'
import { propagateConfigurationState } from '../../redux/importAccounts/utils'

jest.mock('axios')
jest.setTimeout(10000)
describe('Import Account - Tree Search test suite', () => {
  let data
  beforeEach(() => {
    jest.restoreAllMocks()
    data = dataBranches
    console.log('dataInitial', JSON.stringify(data))
  })

  test('Should remove the objects that have value false from tree', () => {
    const configuration = updateTreeValues(data, [
      'data.loyalty',
      'data.loyalty.rewardRedemption',
      'data.loyalty.rewardRedemption.redemptionDate',
      'data.loyalty.rewardRedemption.redemptionPoint',
    ])
    const removeNodes = removeNodesFromTree(data, ['data.loyalty.loyaltyStatus', 'data.loyalty.rewardAmount'])
    propagateConfigurationState(removeNodes[0], true)
    const onlyTrueValues = TreeSearch.removeFalseValuesFromTree(configuration[0])
    expect(onlyTrueValues).toEqual(removeNodes[0])
  })

  test('Should return the names that have value true with no property', () => {
    const expectedSubscriptionValues = [
      'subscriptions.newsletter.commercial.isSubscribed',
      'subscriptions.newsletter.commercial.tags',
      'subscriptions.newsletter.commercial.lastUpdatedSubscriptionState',
      'subscriptions.newsletter.commercial.doubleOptIn.isExternallyVerified',
    ]
    const configuration = propagateConfigurationState(subscriptionsBranches[0], true)
    const getTrueValues = TreeSearch.getCheckedOptionsFromTree([configuration])
    expect(getTrueValues).toEqual(expectedSubscriptionValues)
  })
  test('Should return the names that have value true with parent switchId array and children switchId object', () => {
    const expectedDataResult = ['loyalty.0.rewardPoints', 'loyalty.0.rewardRedemption.redemptionDate', 'loyalty.0.rewardRedemption.redemptionPoint']
    const configuration = propagateConfigurationState(data[0], true)
    changeSwitchId(configuration, 'data.loyalty', 'array')
    changeSwitchId(configuration, 'data.loyalty.rewardRedemption', 'object')
    const options = TreeSearch.getCheckedOptionsFromTree([configuration], true)
    expect(options).toEqual(expectedDataResult)
  })
  test('Should return the names that have value true with both parent and children have switchId array', () => {
    const expectedDataResult = ['loyalty.0.rewardPoints', 'loyalty.0.rewardRedemption.0.redemptionDate', 'loyalty.0.rewardRedemption.0.redemptionPoint']
    const configuration = propagateConfigurationState(dataBranches[0], true)
    changeSwitchId(configuration, 'data.loyalty', 'array')
    changeSwitchId(configuration, 'data.loyalty.rewardRedemption', 'array')
    const options = TreeSearch.getCheckedOptionsFromTree([configuration], true)
    expect(options).toEqual(expectedDataResult)
  })
  test('Should return the names that have value true with parent switchId object and children switchId array', () => {
    const expectedDataResult = ['loyalty.rewardPoints', 'loyalty.rewardRedemption.0.redemptionDate', 'loyalty.rewardRedemption.0.redemptionPoint']
    const configuration = propagateConfigurationState(dataBranches[0], true)
    changeSwitchId(configuration, 'data.loyalty', 'object')
    changeSwitchId(configuration, 'data.loyalty.rewardRedemption', 'array')
    const options = TreeSearch.getCheckedOptionsFromTree([configuration], true)
    expect(options).toEqual(expectedDataResult)
  })
  test('Should return the names that have value true with both parent and children switchId object', () => {
    const expectedDataResult = ['loyalty.rewardPoints', 'loyalty.rewardRedemption.redemptionDate', 'loyalty.rewardRedemption.redemptionPoint']
    const configuration = propagateConfigurationState(dataBranches[0], true)
    changeSwitchId(configuration, 'data.loyalty', 'object')
    changeSwitchId(configuration, 'data.loyalty.rewardRedemption', 'object')
    const options = TreeSearch.getCheckedOptionsFromTree([configuration], true)
    expect(options).toEqual(expectedDataResult)
  })
})

function updateTreeValues(tree, targetIds) {
  tree.forEach((node) => {
    if (targetIds.includes(node.id)) {
      node.value = true
    }
    if (node.branches && node.branches.length > 0) {
      updateTreeValues(node.branches, targetIds)
    }
  })
  return tree
}
function removeNodesFromTree(tree, targetIds) {
  return tree.filter((node) => {
    if (targetIds.includes(node.id)) {
      return false
    }
    if (node.branches && node.branches.length > 0) {
      node.branches = removeNodesFromTree(node.branches, targetIds)
    }
    return true
  })
}
const changeSwitchId = (configuration, targetId, newSwitchId) => {
  if (configuration.id === targetId) {
    configuration.switchId = newSwitchId
  }
  if (configuration.branches) {
    configuration.branches.forEach((branch) => {
      changeSwitchId(branch, targetId, newSwitchId)
    })
  }
  return configuration
}
