/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */
export const getCdcData = function () {
  const responses = [
    { name: 'webSdk', promise: this.webSdk.get() },
    { name: 'dataflow', promise: this.dataflow.search() },
    { name: 'emails', promise: this.emails.get() },
    { name: 'extension', promise: this.extension.get() },
    { name: 'policies', promise: this.policies.get() },
    { name: 'rba', promise: this.rba.get() },
    { name: 'riskAssessment', promise: this.riskAssessment.get() },
    { name: 'schema', promise: this.schema.get() },
    { name: 'sets', promise: this.screenSets.get() },
    { name: 'sms', promise: this.sms.get() },
    { name: 'channel', promise: this.channel.get() },
  ]
  return responses
}

export const fetchCDCConfigs = async function () {
  const cdcDataArray = this.getCdcData.bind(this)()
  if (!Array.isArray(cdcDataArray)) {
    throw new Error('getCdcData must return an array')
  }
  const cdcData = await Promise.all(
    cdcDataArray.map(async ({ name, promise }) => {
      const data = await promise.catch((err) => console.error(`Error resolving ${name}:`, err))
      return { [name]: data }
    }),
  )
  return Object.assign({}, ...cdcData)
}
