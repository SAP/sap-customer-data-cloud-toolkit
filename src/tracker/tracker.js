/*
 * Copyright (c) 2023 SAP SE or an SAP affiliate company.
 * All rights reserved.
 *
 * This software is the confidential and proprietary information of SAP
 * ("Confidential Information"). You shall not disclose such Confidential
 * Information and shall use it only in accordance with the terms of the
 * license agreement you entered into with SAP.
 */

export const Tracker = {
  applicationName: 'Customer Data Cloud Toolbox',
  distributionList: 'DL CX Automation Tracker - Customer Data Cloud Toolbox <DL_64219B11753A88028E183E70@global.corp.sap>',
}

Tracker.subject = `[CX Automation Tracker] ${Tracker.applicationName}`
Tracker.body = `Dear user, %0D%0A
%0D%0A
Thank you for helping us track usages!%0D%0A 
Just fill the project name and click "send" to report 1 usage of ${Tracker.applicationName}.%0D%0A
%0D%0A
Project name: `

Tracker.reportUsage = function () {
    window.open(`mailto:${Tracker.distributionList}?subject=${Tracker.subject}&body=${Tracker.body}`, '_blank', 'noopener')
}
