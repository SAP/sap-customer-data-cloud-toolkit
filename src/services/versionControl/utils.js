import Options from '../copyConfig/options'

export const createOptions = (type, items, formatName = true) => {
  if (!Array.isArray(items)) {
    console.log('itens', items)

    if (typeof items === 'object' && items !== null) {
      items = Object.values(items)
    } else {
      throw new TypeError(`Expected an array or object for items, but got ${typeof items}`)
    }
  }

  const optionsData = {
    id: type,
    name: type,
    value: false,
    formatName,
    branches: items.map((item) => ({
      id: item.name,
      name: item.name,
      value: true,
      formatName: false,
    })),
  }

  return new Options(optionsData)
}
