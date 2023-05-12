/*
 * Copyright (c) 2023 SAP SE or an SAP affiliate company.
 * All rights reserved.
 *
 * This software is the confidential and proprietary information of SAP
 * ("Confidential Information"). You shall not disclose such Confidential
 * Information and shall use it only in accordance with the terms of the
 * license agreement you entered into with SAP.
 */

import { ThemeProvider } from '@ui5/webcomponents-react'

import SiteDeployer from './routes/site-deployer/site-deployer.component'
import EmailTemplates from './routes/email-templates/email-templates.component'
import SmsTemplates from './routes/sms-templates/sms-templates.component'
import CopyConfigurationExtended from './routes/copy-configuration-extended/copy-configuration-extended.component'
import CredentialsPopoverButton from './components/credentials-popover-button/credentials-popover-button.component'

import { ROUTE_CONTAINER_CLASS, ROUTE_SITE_DEPLOYER, ROUTE_EMAIL_TEMPLATES, ROUTE_SMS_TEMPLATES, ROUTE_COPY_CONFIG_EXTENDED, TOPBAR_MENU_CONTAINER_CLASS } from './inject/constants'

import './App.css'

function App() {
  return (
    <ThemeProvider>
      <div className="App">
        <div className={ROUTE_CONTAINER_CLASS} route={ROUTE_SITE_DEPLOYER}>
          <SiteDeployer />
        </div>
        <div className={ROUTE_CONTAINER_CLASS} route={ROUTE_EMAIL_TEMPLATES}>
          <EmailTemplates />
        </div>
        <div className={ROUTE_CONTAINER_CLASS} route={ROUTE_SMS_TEMPLATES}>
          <SmsTemplates />
        </div>
        <div className={ROUTE_CONTAINER_CLASS} route={ROUTE_COPY_CONFIG_EXTENDED}>
          <CopyConfigurationExtended />
        </div>
      </div>
      <div className={TOPBAR_MENU_CONTAINER_CLASS}>
        <CredentialsPopoverButton />
      </div>
    </ThemeProvider>
  )
}

export default App
