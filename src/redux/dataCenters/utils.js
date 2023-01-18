import dataCenters from './dataCenters.json'

export const getDataCenters = (host = window.location.hostname) => dataCenters.filter((dataCenter) => dataCenter.console === host)[0].datacenters
