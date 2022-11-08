import EmailTemplateNameTranslator from '../gigya/emailTemplateNameTranslator'
import Email from './email'
import EmailTemplate from './emailTemplate'

class EmailManager {
  static #EMAIL_TEMPLATE_IDENTIFIER = 'mailTemplates'

  constructor(credentials) {
    this.credentials = credentials
    this.emailService = new Email(credentials.userKey, credentials.secret)
  }

  async export(site) {
    console.log(`Exporting email templates for site ${site}`)
    const emailTemplatesResponse = await this.emailService.getSiteEmails(site)
    if (emailTemplatesResponse.errorCode !== 0) {
      return emailTemplatesResponse
    }
    return EmailManager.getEmailTemplateNames3(emailTemplatesResponse)
    // const emailTemplates = this.getAllTemplates(emailTemplatesResponse)
    // emailTemplates.forEach((template) => {
    //   //EmailTemplate.export(template)
    //   const obj = this.exportTemplate(template)
    //   //emailTemplatesResponse[this.getRootProperty(obj)] = obj[this.getRootProperty(obj)]
    // })
    // const a = 0
    // //string = emailTemplates.process(emailTemplates[i])
    // //   File.create(templateName, lang, template)
    // //   File.create(name, content)
    // //   File.zip('')
    // return emailTemplatesResponse
  }

  getAllTemplates(response) {
    const emailTemplates = []
    const emailTemplateNames = this.getEmailTemplateNames(response)
    emailTemplateNames.forEach((name) => {
      const template = {}
      template[name] = response[name]
      emailTemplates.push(template)
    })
    return emailTemplates
  }

  //   hasEmailTemplate(response) {
  //     return function (key) {
  //       console.log(`key=${key}`)
  //       const objProperties = EmailManager.propertiesToArray(response[key])
  //       console.log(`objProperties=${objProperties}`)
  //       let res = objProperties.filter((prop) => {
  //         const res = prop.includes(EmailManager.#EMAIL_TEMPLATE_IDENTIFIER)
  //         console.log(`prop=${prop}, res=${res}`)
  //         return res
  //       })
  //       console.log(`res=${res}`)
  //       if (res.length === 0) {
  //         res = false
  //       }
  //       console.log(`returned=${res}`)
  //       return res
  //     }
  //   }

  //   getEmailTemplateNames(response) {
  //     const names = Object.keys(response).filter(this.hasEmailTemplate(response), this)
  //     console.log(`names=${names}`)
  //     return names
  //   }

  getEmailTemplateNames2(key, response) {
    console.log(`key=${key}`)
    const objProperties = EmailManager.propertiesToArray(response[key])
    console.log(`objProperties=${objProperties}`)
    let res = objProperties.filter((prop) => {
      const res = prop.includes(EmailManager.#EMAIL_TEMPLATE_IDENTIFIER)
      console.log(`prop=${prop}, res=${res}`)
      return res
    })
    console.log(`res=${res}`)
    if (res.length === 0) {
      res = []
    } else {
      res = this.parseProperties(key, res)
    }
    console.log(`returned=${res}`)
    return res
  }

  getEmailTemplateNames(response) {
    const externalTemplateNames = []
    Object.keys(response).forEach((key) => {
      const templateNames = this.getEmailTemplateNames2(key, response)
      if (templateNames.length > 0) {
        externalTemplateNames.push(...templateNames)
      }
    })
    console.log(`names=${externalTemplateNames}`)
    return externalTemplateNames
  }

  parseProperties(name, properties) {
    const templateNames = new Set()
    properties.forEach((property) => {
      const tokens = [name, ...property.split('.')]
      for (let i = 0; i < tokens.length; ++i) {
        const externalTemplateName = EmailTemplateNameTranslator.translate(tokens[i])
        if (externalTemplateName !== undefined) {
          //templateNames.add(externalTemplateName)
          templateNames.add(tokens[i])
          break
        }
      }
    })
    return Array.from(templateNames)
  }

  static propertiesToArray(obj) {
    const isObject = (val) => val && typeof val === 'object' && !Array.isArray(val)

    const addDelimiter = (a, b) => (a ? `${a}.${b}` : b)

    const paths = (obj = {}, head = '') => {
      if (!isObject(obj)) return []
      return Object.entries(obj).reduce((product, [key, value]) => {
        let fullPath = addDelimiter(head, key)
        return isObject(value) ? product.concat(paths(value, fullPath)) : product.concat(fullPath)
      }, [])
    }

    return paths(obj)
  }

  static getTemplatesForEachLanguage(templateObj) {
    const properties = EmailManager.propertiesToArray(templateObj)
    let templatePath = ''
    for (const property of properties) {
      if (property.includes(EmailManager.#EMAIL_TEMPLATE_IDENTIFIER)) {
        templatePath = property.slice(0, property.lastIndexOf('.'))
        break
      }
    }
    let obj = templateObj
    templatePath.split('.').forEach((prop) => (obj = obj[prop]))
    return obj
  }

  exportTemplate(templateObj) {
    const languageTemplates = EmailManager.getTemplatesForEachLanguage(templateObj)

    for (const language of Object.keys(languageTemplates)) {
      const filePath = this.Filecreate(this.getRootProperty(templateObj), language, languageTemplates[language])
      languageTemplates[language] = filePath
    }
    return templateObj
  }

  static Filecreate(templateName, language, template) {
    return `${templateName}/${language}.html`
  }

  getRootProperty(obj) {
    for (const property in obj) {
      return property
    }
    return obj
  }

  // -----
  static getEmailTemplateNames3(response) {
    const objProperties = EmailManager.propertiesToArray(response)
    let templateProperties = objProperties.filter((prop) => {
      const res = prop.includes(EmailManager.#EMAIL_TEMPLATE_IDENTIFIER)
      return res
    })

    templateProperties.forEach((templatePath) => {
      console.log(`templatePath=${templatePath}`)
    })
    const templatePaths = EmailManager.getTemplatePaths(templateProperties)
    const templateObjects = EmailManager.getTemplateObjects(templateProperties, response)
    const templates = EmailManager.getTemplates(templateProperties, response)
    for (const [templateName, templateObject] of templates) {
      //Object.keys(templates).forEach((templateName) => {
      const externalTemplateName = EmailTemplateNameTranslator.translate(templateName)
      for (const language of Object.keys(templateObject)) {
        const filePath = EmailManager.Filecreate(externalTemplateName, language, templateObject[language])
        templateObject[language] = filePath
      }
    }

    // let pathIndex = 0
    // templateObjects.forEach((templateObject) => {
    //   const templateName = EmailManager.getTemplateName4(templatePaths[pathIndex++])
    //   const externalTemplateName = EmailTemplateNameTranslator.translate(templateName)
    //   for (const language of Object.keys(templateObject)) {
    //     const filePath = EmailManager.Filecreate(externalTemplateName, language, templateObject[language])
    //     templateObject[language] = filePath
    //   }
    // })
    // write template objects to file
    // zip files
    return response

    // console.log(`res=${res}`)
    // if (res.length === 0) {
    //   res = []
    // } else {
    //   res = this.parseProperties(key, res)
    // }
    // console.log(`returned=${res}`)
    // return res
  }

  static getTemplatePaths(templateProperties) {
    const templatePaths = new Set()
    templateProperties.forEach((property) => {
      const tokens = property.split('.')
      let templatePath = ''
      for (let i = 0; i < tokens.length; ++i) {
        templatePath = templatePath.concat('.', tokens[i])
        if (EmailTemplateNameTranslator.exists(tokens[i])) {
          templatePaths.add(templatePath.slice(1))
          break
        }
      }
    })
    return Array.from(templatePaths)
  }

  static getTemplateObjects(templateProperties, response) {
    const templateObjects = []
    const templatePropertiesWithoutLanguage = new Set()
    templateProperties.forEach((templateProperty) => {
      templatePropertiesWithoutLanguage.add(templateProperty.slice(0, templateProperty.lastIndexOf('.')))
    })
    templatePropertiesWithoutLanguage.forEach((templatePath) => {
      let obj = response
      templatePath.split('.').forEach((prop) => (obj = obj[prop]))
      templateObjects.push(obj)
    })
    return templateObjects
  }

  static getTemplateName4(templatePath) {
    const firstIndex = templatePath.indexOf('.')
    const lastIndex = templatePath.lastIndexOf('.')
    if (firstIndex === lastIndex) {
      if (firstIndex > 0) {
        return templatePath.slice(firstIndex + 1)
      }
      return templatePath
    }
    return templatePath.slice(firstIndex, lastIndex)
  }

  static getTemplates(templateProperties, response) {
    const templateObjects = new Map()
    const templatePropertiesWithoutLanguage = new Set()
    templateProperties.forEach((templateProperty) => {
      templatePropertiesWithoutLanguage.add(templateProperty.slice(0, templateProperty.lastIndexOf('.')))
    })
    templatePropertiesWithoutLanguage.forEach((templatePath) => {
      let templateName
      let obj = response
      templatePath.split('.').forEach((prop) => {
        if (templateName === undefined && EmailTemplateNameTranslator.exists(prop)) {
          templateName = prop
        }
        obj = obj[prop]
      })
      //templateObjects.push(obj)
      //EmailManager.addToMap(templateObjects, templateName, obj)
      if (templateName !== undefined) {
        templateObjects.set(templateName, obj)
      }
    })
    return templateObjects
  }

  //   static addToMap(map, key, value) {
  //     if (map.has(key)) {
  //       map.get(key).push(value)
  //     } else {
  //       map.sets(key, [value])
  //     }
  //   }
}

export default EmailManager
