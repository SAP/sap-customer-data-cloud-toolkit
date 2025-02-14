import Options from '../copyConfig/options'

export const createOptions = (items) => {
  if (!Array.isArray(items)) {
    if (typeof items === 'object' && items !== null) {
      items = Object.values(items)
    } else {
      throw new TypeError(`Expected an array or object for items, but got ${typeof items}`)
    }
  }

  const optionsData = {
    branches: items.map((item) => ({
      name: item.name,
      value: true,
    })),
  }

  return new Options(optionsData)
}
