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
    const emailTemplates = this.getAllTemplates(emailTemplatesResponse)
    emailTemplates.forEach((template) => {
      //EmailTemplate.export(template)
      const obj = this.exportTemplate(template)
      //emailTemplatesResponse[this.getRootProperty(obj)] = obj[this.getRootProperty(obj)]
    })
    const a = 0
    //string = emailTemplates.process(emailTemplates[i])
    //   File.create(templateName, lang, template)
    //   File.create(name, content)
    //   File.zip('')
    return emailTemplatesResponse
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

  hasEmailTemplate(response) {
    return function (key) {
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
        res = false
      }
      console.log(`returned=${res}`)
      return res
    }
  }

  getEmailTemplateNames(response) {
    const names = Object.keys(response).filter(this.hasEmailTemplate(response), this)
    return names
  }

  static propertiesToArray(obj) {
    const isObject = (val) => val && typeof val === 'object' && !Array.isArray(val)

    const addDelimiter = (a, b) => (a ? `${a}.${b}` : b)

    const paths = (obj = {}, head = '') => {
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

  Filecreate(templateName, language, template) {
    return `${templateName}/${language}.html`
  }

  getRootProperty(obj) {
    for (const property in obj) {
      return property
    }
    return obj
  }
}

export default EmailManager
