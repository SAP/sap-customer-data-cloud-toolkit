/*
 * Copyright (c) 2023 SAP SE or an SAP affiliate company.
 * All rights reserved.
 *
 * This software is the confidential and proprietary information of SAP
 * ("Confidential Information"). You shall not disclose such Confidential
 * Information and shall use it only in accordance with the terms of the
 * license agreement you entered into with SAP.
 */

// Console.log styles, ex: console.log('SAP Customer Data Cloud Toolbox - %cLoaded', logStyles.green)
const padding = 'padding: 2px 4px'
const borderRadius = 'border-radius: 4px'
export const logStyles = {
  lightGreenBold: ['color: #000', 'background-color: #50e591', padding, borderRadius, 'font-weight: bold'].join(';'),
  green: ['color: #fff', 'background-color: green', padding, borderRadius].join(';'),
  gray: ['color: #fff', 'background-color: #444', padding, borderRadius].join(';'),
}
