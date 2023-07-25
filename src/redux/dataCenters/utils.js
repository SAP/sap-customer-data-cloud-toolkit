/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */


import dataCenters from './dataCenters.json'

export const getDataCenters = (host = window.location.hostname) => dataCenters.filter((dataCenter) => dataCenter.console === host)[0].datacenters
