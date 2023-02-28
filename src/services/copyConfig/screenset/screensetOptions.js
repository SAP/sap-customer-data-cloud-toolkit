import Options from '../options'

class ScreenSetOptions extends Options {
  #screenSet

  constructor(screenSet) {
    const SCREEN_SET_COLLECTION_DEFAULT = 'Default'
    super({
      id: 'screenSets',
      name: 'screenSets',
      value: true,
      branches: [
        {
          id: SCREEN_SET_COLLECTION_DEFAULT,
          name: SCREEN_SET_COLLECTION_DEFAULT,
          value: true,
          branches: [
            {
              id: `${SCREEN_SET_COLLECTION_DEFAULT}-LinkAccounts`,
              name: `${SCREEN_SET_COLLECTION_DEFAULT}-LinkAccounts`,
              value: true,
            },
            {
              id: `${SCREEN_SET_COLLECTION_DEFAULT}-LiteRegistration`,
              name: `${SCREEN_SET_COLLECTION_DEFAULT}-LiteRegistration`,
              value: true,
            },
            {
              id: `${SCREEN_SET_COLLECTION_DEFAULT}-OrganizationRegistration`,
              name: `${SCREEN_SET_COLLECTION_DEFAULT}-OrganizationRegistration`,
              value: true,
            },
            {
              id: `${SCREEN_SET_COLLECTION_DEFAULT}-PasswordlessLogin`,
              name: `${SCREEN_SET_COLLECTION_DEFAULT}-PasswordlessLogin`,
              value: true,
            },
            {
              id: `${SCREEN_SET_COLLECTION_DEFAULT}-ProfileUpdate`,
              name: `${SCREEN_SET_COLLECTION_DEFAULT}-ProfileUpdate`,
              value: true,
            },
            {
              id: `${SCREEN_SET_COLLECTION_DEFAULT}-ReAuthentication`,
              name: `${SCREEN_SET_COLLECTION_DEFAULT}-ReAuthentication`,
              value: true,
            },
            {
              id: `${SCREEN_SET_COLLECTION_DEFAULT}-RegistrationLogin`,
              name: `${SCREEN_SET_COLLECTION_DEFAULT}-RegistrationLogin`,
              value: true,
            },
            {
              id: `${SCREEN_SET_COLLECTION_DEFAULT}-Subscriptions`,
              name: `${SCREEN_SET_COLLECTION_DEFAULT}-Subscriptions`,
              value: true,
            },
          ],
        },
      ],
    })
    this.#screenSet = screenSet
  }

  getConfiguration() {
    return this.#screenSet
  }

  setOptions(options) {
    this.options = options
  }

  addCollection(screenSets) {
    this.options.branches = []
    if (screenSets.length === 0) {
      return
    }
    for (const set of screenSets) {
      const collectionName = this.#getCollectionName(set)
      this.#addScreenSetInfo(set, collectionName)
    }
  }

  #getCollectionName(set) {
    const index = set.screenSetID.lastIndexOf('-')
    return set.screenSetID.substring(0, index)
  }

  #addScreenSetInfo(set, collectionName) {
    const collectionInfo = this.options.branches.find((collection) => collection.id === collectionName)
    if (collectionInfo) {
      this.#createScreenSetInfo(set, collectionInfo)
    } else {
      this.#createScreenSetCollectionInfo(set, collectionName)
    }
  }

  #createScreenSetInfo(set, collectionInfo) {
    collectionInfo.branches.push({
      id: set.screenSetID,
      name: set.screenSetID,
      value: true,
    })
  }

  #createScreenSetCollectionInfo(set, collectionName) {
    this.options.branches.push({
      id: collectionName,
      name: collectionName,
      value: true,
      branches: [],
    })
    this.#createScreenSetInfo(set, this.options.branches[this.options.branches.length - 1])
  }
}

export default ScreenSetOptions
