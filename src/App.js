/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */

import { setTheme } from '@ui5/webcomponents-base/dist/config/Theme'
import { ThemeProvider } from '@ui5/webcomponents-react'
import React from 'react'
import { getCurrentConsoleTheme } from './utils/theme'

import './App.css'
import CredentialsPopoverButton from './components/credentials-popover-button/credentials-popover-button.component'
import { useThemeChange } from './hooks/useThemeChange'
import { ROUTE_CONTAINER_CLASS, ROUTE_COPY_CONFIG_EXTENDED, ROUTE_EMAIL_TEMPLATES, ROUTE_SITE_DEPLOYER, ROUTE_SMS_TEMPLATES, TOPBAR_MENU_CONTAINER_CLASS } from './inject/constants'
import CopyConfigurationExtended from './routes/copy-configuration-extended/copy-configuration-extended.component'
import EmailTemplates from './routes/email-templates/email-templates.component'
import SiteDeployer from './routes/site-deployer/site-deployer.component'
import SmsTemplates from './routes/sms-templates/sms-templates.component'

function App() {
  useThemeChange(() => setTheme(getCurrentConsoleTheme()))

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
