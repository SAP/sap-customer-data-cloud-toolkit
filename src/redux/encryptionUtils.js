import crypto from 'crypto-js'

export const encryptData = (dataToEncrypt, key) => {
  try {
    const encryptedJsonString = crypto.AES.encrypt(JSON.stringify(dataToEncrypt), key).toString()
    return encryptedJsonString
  } catch (error) {
    console.error('Error encrypting data:', error)
    return undefined
  }
}

export const decryptData = (encryptedData, key) => {
  try {
    const decryptedJsonString = crypto.AES.decrypt(encryptedData, key).toString(crypto.enc.Utf8)
    if (!decryptedJsonString) {
      console.warn('Decrypted string is empty')
      return undefined
    }
    return JSON.parse(decryptedJsonString)
  } catch (error) {
    console.error('Error decrypting data:', error)
    return undefined
  }
}
