/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */
import { dataBranches } from '../../importAccounts/mainDataSet'
export const expectedSchemaStucture = { id: 'data', name: 'data', value: false, branches: dataBranches, switchId: 'object' }

export const expectedNormalResult = [
  'data.loyalty.rewardPoints',
  'data.loyalty.rewardRedemption.redemptionDate',
  'data.loyalty.rewardRedemption.redemptionPoint',
  'data.loyalty.loyaltyStatus',
  'data.loyalty.rewardAmount',
  'data.vehicle.model',
  'data.vehicle.vin',
  'data.vehicle.registrationDate',
  'data.crm.isProspect',
  'data.crm.abcClassification',
  'data.subscribe',
  'data.terms',
]

export const expectedParentArrayChildObjectResult = [
  'data.loyalty.0.rewardPoints',
  'data.loyalty.0.rewardRedemption.redemptionDate',
  'data.loyalty.0.rewardRedemption.redemptionPoint',
  'data.loyalty.0.loyaltyStatus',
  'data.loyalty.0.rewardAmount',
  'data.vehicle.model',
  'data.vehicle.vin',
  'data.vehicle.registrationDate',
  'data.crm.isProspect',
  'data.crm.abcClassification',
  'data.subscribe',
  'data.terms',
]

export const expectedParentChildArrayResult = [
  'data.loyalty.0.rewardPoints',
  'data.loyalty.0.rewardRedemption.0.redemptionDate',
  'data.loyalty.0.rewardRedemption.0.redemptionPoint',
  'data.loyalty.0.loyaltyStatus',
  'data.loyalty.0.rewardAmount',
  'data.vehicle.model',
  'data.vehicle.vin',
  'data.vehicle.registrationDate',
  'data.crm.isProspect',
  'data.crm.abcClassification',
  'data.subscribe',
  'data.terms',
]

export const expectedParentObjectChildArrayResult = [
  'data.loyalty.rewardPoints',
  'data.loyalty.rewardRedemption.0.redemptionDate',
  'data.loyalty.rewardRedemption.0.redemptionPoint',
  'data.loyalty.loyaltyStatus',
  'data.loyalty.rewardAmount',
  'data.vehicle.model',
  'data.vehicle.vin',
  'data.vehicle.registrationDate',
  'data.crm.isProspect',
  'data.crm.abcClassification',
  'data.subscribe',
  'data.terms',
]
