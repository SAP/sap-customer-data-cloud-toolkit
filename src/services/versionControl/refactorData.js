// export function refactorData(data) {
//   const finalResult = []
//   data.map((item) => {
//     const { callId, time, ...rest } = item
//     finalResult.push(rest)
//     return finalResult
//   })
//   console.log('finalResult: ', finalResult)
//   return finalResult
// }

export function refactorData(data) {
  if (Array.isArray(data)) {
    return data.map(refactorData); // recursively process array elements
  } else if (typeof data === 'object' && data !== null) {
    const { callId, time, ...rest } = data;
    for (const key in rest) {
      if (rest.hasOwnProperty(key)) {
        rest[key] = refactorData(rest[key]); // recursively process nested objects
      }
    }
    return rest;
  }
  return data; // return non-object or non-array values as they are
}
