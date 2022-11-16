import EmailTemplateNameTranslator from '../gigya/emailTemplateNameTranslator'
import Email from './email'
import FileManager from '../file/fileManager'
import pkg from '../../../package.json'

class EmailManager {
  static #EMAIL_TEMPLATE_IDENTIFIER = 'mailTemplates'
  static #IMPORT_EXPORT_METADATA_FILE_NAME = 'impexMetadata.json'

  constructor(credentials) {
    this.credentials = credentials
    this.emailService = new Email(credentials.userKey, credentials.secret)
  }

  async export(site) {
    console.log(`Exporting email templates for site ${site}`)
    const emailTemplatesResponse = await this.exportTemplates(site)

    const fileManager = new FileManager(pkg.name)
    fileManager.create(EmailManager.#IMPORT_EXPORT_METADATA_FILE_NAME, JSON.stringify(emailTemplatesResponse))
    const zipContent = await fileManager.createZipArchive('email_templates')
    fileManager.deleteWorkDir()
    return zipContent
  }

  async exportTemplates(site) {
    const emailTemplatesResponse = await this.emailService.getSiteEmails(site)
    if (emailTemplatesResponse.errorCode === 0) {
      const templates = this.#getEmailTemplates(emailTemplatesResponse)
      this.#exportEmailTemplates(templates)
    }
    return emailTemplatesResponse
  }

  #getEmailTemplates(response) {
    const responseProperties = this.#buildResponsePropertiesPath(response)
    const templatePropertiesPath = responseProperties.filter((prop) => {
      return prop.includes(EmailManager.#EMAIL_TEMPLATE_IDENTIFIER)
    })
    return this.#getTemplates(templatePropertiesPath, response)
  }

  #exportEmailTemplates(templates) {
    const fileManager = new FileManager(pkg.name)
    for (const [templateName, templateObject] of templates) {
      const externalTemplateName = EmailTemplateNameTranslator.translate(templateName)
      for (const language of Object.keys(templateObject)) {
        const filePath = fileManager.createFile(externalTemplateName, language, templateObject[language])
        templateObject[language] = filePath
      }
    }
  }

  #getTemplates(templateProperties, response) {
    const templateObjectsMap = new Map()
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
      if (templateName !== undefined) {
        templateObjectsMap.set(templateName, obj)
      }
    })
    return templateObjectsMap
  }

  #buildResponsePropertiesPath(propertiesPath) {
    const isObject = (val) => val && typeof val === 'object' && !Array.isArray(val)

    const addDelimiter = (a, b) => (a ? `${a}.${b}` : b)

    const paths = (obj = {}, head = '') => {
      if (!isObject(obj)) {
        return []
      }
      return Object.entries(obj).reduce((product, [key, value]) => {
        const fullPath = addDelimiter(head, key)
        return isObject(value) ? product.concat(paths(value, fullPath)) : product.concat(fullPath)
      }, [])
    }

    return paths(propertiesPath)
  }
}

export default EmailManager
