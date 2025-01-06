import { getOptionsFromSchemaTree } from './utils'
import {
  expectedNormalResult,
  expectedParentArrayChildObjectResult,
  expectedParentArrayChildObjectStructure,
  expectedParentChildArrayResult,
  expectedParentChildArrayStructure,
  expectedParentObjectChildArrayResult,
  expectedParentObjectChildArrayStructure,
  expectedSchemaStucture,
} from './utilsDatatest'

jest.mock('axios')
jest.setTimeout(10000)

describe('Utils - Should get options from schema tree test suite', () => {
  beforeEach(() => {
    jest.restoreAllMocks()
  })

  test('Should get options where parent and child have switchid objects', () => {
    const result = getOptionsFromSchemaTree(expectedSchemaStucture)
    expect(result).toEqual(expectedNormalResult)
  })
  test('Should get options where parent has switchId array and child has switchid object', () => {
    const result = getOptionsFromSchemaTree(expectedParentArrayChildObjectStructure)
    expect(result).toEqual(expectedParentArrayChildObjectResult)
  })
  test('Should get options where parent and child has switchid array', () => {
    const result = getOptionsFromSchemaTree(expectedParentChildArrayStructure)
    expect(result).toEqual(expectedParentChildArrayResult)
  })
  test('Should get options where parent has switchId object and child has switchid array', () => {
    const result = getOptionsFromSchemaTree(expectedParentObjectChildArrayStructure)
    expect(result).toEqual(expectedParentObjectChildArrayResult)
  })
})
