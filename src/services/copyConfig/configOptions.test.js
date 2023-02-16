import { getInfoExpectedResponse } from './info/dataTest'
import ConfigOptions from './configOptions'
import Schema from './schema/schema'
import Social from './social/social'
import SmsConfiguration from './sms/smsConfiguration'
import SchemaOptions from './schema/schemaOptions'
import SocialOptions from './social/socialOptions'
import SmsOptions from './sms/smsOptions'

describe('Copy Options test suite', () => {
  const schema = new Schema('', '', '')
  const schemaOptions = new SchemaOptions(schema)
  const socialOptions = new SocialOptions(new Social('', '', ''))
  const smsOptions = new SmsOptions(new SmsConfiguration('', '', ''))
  let options

  beforeEach(() => {
    options = JSON.parse(JSON.stringify(getInfoExpectedResponse(false)))
  })

  test('should be copied dataSchema', async () => {
    expect(new ConfigOptions(options).shouldBeCopied(schemaOptions)).toBeFalsy()
    expect(new ConfigOptions(options).shouldBeCopied(socialOptions)).toBeFalsy()
    expect(new ConfigOptions(options).shouldBeCopied(smsOptions)).toBeFalsy()
    options[0].branches[0].value = true // dataSchema
    expect(new ConfigOptions(options).shouldBeCopied(schemaOptions)).toBeTruthy()
    expect(new ConfigOptions(options).shouldBeCopied(socialOptions)).toBeFalsy()
    expect(new ConfigOptions(options).shouldBeCopied(smsOptions)).toBeFalsy()

    options[0].branches[0].value = false
    options[0].branches[1].value = true // profileSchema
    expect(new ConfigOptions(options).shouldBeCopied(schemaOptions)).toBeTruthy()
    expect(new ConfigOptions(options).shouldBeCopied(socialOptions)).toBeFalsy()
    expect(new ConfigOptions(options).shouldBeCopied(smsOptions)).toBeFalsy()
  })

  test('should all be copied except dataSchema', async () => {
    options[3].value = true // social
    expect(new ConfigOptions(options).shouldBeCopied(schemaOptions)).toBeFalsy()
    expect(new ConfigOptions(options).shouldBeCopied(socialOptions)).toBeTruthy()
    expect(new ConfigOptions(options).shouldBeCopied(smsOptions)).toBeFalsy()
    options[5].value = true // sms
    expect(new ConfigOptions(options).shouldBeCopied(schemaOptions)).toBeFalsy()
    expect(new ConfigOptions(options).shouldBeCopied(socialOptions)).toBeTruthy()
    expect(new ConfigOptions(options).shouldBeCopied(smsOptions)).toBeTruthy()
  })

  test('should all be copied', async () => {
    options = JSON.parse(JSON.stringify(getInfoExpectedResponse(true)))
    expect(new ConfigOptions(options).shouldBeCopied(schemaOptions)).toBeTruthy()
    expect(new ConfigOptions(options).shouldBeCopied(socialOptions)).toBeTruthy()
    expect(new ConfigOptions(options).shouldBeCopied(smsOptions)).toBeTruthy()
  })

  test('should single copied', async () => {
    const schemaOption = {
      id: 'schema',
      name: 'schema',
      value: false,
      branches: [
        {
          id: 'profileSchema',
          name: 'profileSchema',
          value: true,
        },
      ],
    }
    options = JSON.parse(JSON.stringify([schemaOption]))
    expect(new ConfigOptions(options).shouldBeCopied(schemaOptions)).toBeTruthy()
    expect(new ConfigOptions(options).shouldBeCopied(socialOptions)).toBeFalsy()
    expect(new ConfigOptions(options).shouldBeCopied(smsOptions)).toBeFalsy()
  })
})
