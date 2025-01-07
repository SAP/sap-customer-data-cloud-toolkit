/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */

import { dataBranches } from '../../importAccounts/mainDataSet'

export const expectedOptions = { id: 'data', name: 'data', value: false, branches: dataBranches, switchId: 'object' }

export const expectedSchemaResult = [
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
