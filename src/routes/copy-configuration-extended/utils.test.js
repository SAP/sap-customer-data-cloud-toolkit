import { areConfigurationsFilled } from './utils'
import { configurationsMockedResponse } from '../../redux/copyConfigurationExtendend/dataTest'

describe('copyConfigurationExtended utils test suite', () => {
  test('return false if no checkboxes are filled', () => {
    configurationsMockedResponse[0].value = false
    configurationsMockedResponse[0].branches[0].value = false
    configurationsMockedResponse[0].branches[1].value = false
    expect(areConfigurationsFilled(configurationsMockedResponse)).toEqual(false)
  })
  test('return true if a first level checkbox is filled', () => {
    configurationsMockedResponse[1].value = true
    expect(areConfigurationsFilled(configurationsMockedResponse)).toEqual(true)
  })
  test('return true if a second level checkbox is filled', () => {
    configurationsMockedResponse[0].branches[0].value = true
    expect(areConfigurationsFilled(configurationsMockedResponse)).toEqual(true)
  })
  test('return true if a third level checkbox is filled', () => {
    configurationsMockedResponse[2].branches[0].branches[0].value = true
    expect(areConfigurationsFilled(configurationsMockedResponse)).toEqual(true)
  })
})
