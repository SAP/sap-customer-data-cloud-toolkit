export function refactorData(data) {
  const finalResult = []
  data.map((item) => {
    const { callId, time, ...rest } = item
    finalResult.push(rest)
    return finalResult
  })
  console.log('finalResult: ', finalResult)
  return finalResult
}
