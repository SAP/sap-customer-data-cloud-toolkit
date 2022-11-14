class UrlBuilder {
  static buildUrl(namespace, dataCenter, endpoint) {
    const protocol = 'https'
    const domain = 'gigya.com'
    return `${protocol}://${namespace}.${dataCenter}.${domain}/${endpoint}`
  }
}

export default UrlBuilder
