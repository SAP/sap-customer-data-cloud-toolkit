/*
 * Copyright (c) 2023 SAP SE or an SAP affiliate company.
 * All rights reserved.
 *
 * This software is the confidential and proprietary information of SAP
 * ("Confidential Information"). You shall not disclose such Confidential
 * Information and shall use it only in accordance with the terms of the
 * license agreement you entered into with SAP.
 */

import Options from '../options'

class SchemaOptions extends Options {
  static DATA_SCHEMA = 'dataSchema'
  static PROFILE_SCHEMA = 'profileSchema'
  static SUBSCRIPTIONS_SCHEMA = 'subscriptionsSchema'
  #schema

  constructor(schema) {
    super({
      id: 'schema',
      name: 'schema',
      value: true,
      branches: [
        {
          id: SchemaOptions.DATA_SCHEMA,
          name: SchemaOptions.DATA_SCHEMA,
          value: true,
        },
        {
          id: SchemaOptions.PROFILE_SCHEMA,
          name: SchemaOptions.PROFILE_SCHEMA,
          value: true,
        },
        {
          id: SchemaOptions.SUBSCRIPTIONS_SCHEMA,
          name: SchemaOptions.SUBSCRIPTIONS_SCHEMA,
          value: true,
        }
      ],
    })
    this.#schema = schema
  }

  getConfiguration() {
    return this.#schema
  }

  removeDataSchema(info) {
    return this.removeInfo(SchemaOptions.DATA_SCHEMA, info)
  }

  removeProfileSchema(info) {
    return this.removeInfo(SchemaOptions.PROFILE_SCHEMA, info)
  }

  removeSubscriptionsSchema(info) {
    return this.removeInfo(SchemaOptions.SUBSCRIPTIONS_SCHEMA, info)
  }
}

export default SchemaOptions
