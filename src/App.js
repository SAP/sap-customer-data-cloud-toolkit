/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */

import { setTheme } from '@ui5/webcomponents-base/dist/config/Theme'
import { ThemeProvider } from '@ui5/webcomponents-react'
import React from 'react'
import { getCurrentConsoleTheme } from './utils/theme'

import './App.css'
import { useThemeChange } from './hooks/useThemeChange'
import { ROUTE_CONTAINER_CLASS, ROUTE_COPY_CONFIG_EXTENDED, ROUTE_EMAIL_TEMPLATES, ROUTE_SITE_DEPLOYER, ROUTE_SMS_TEMPLATES } from './inject/constants'
import CopyConfigurationExtended from './routes/copy-configuration-extended/copy-configuration-extended.component'
import EmailTemplates from './routes/email-templates/email-templates.component'
import SiteDeployer from './routes/site-deployer/site-deployer.component'
import SmsTemplates from './routes/sms-templates/sms-templates.component'

import '@sap_oss/automated-usage-tracking-tool/theme/sap_horizon.css'
import { requestConsentConfirmation } from './lib/tracker'

function App() {
  useThemeChange(() => setTheme(getCurrentConsoleTheme()))
  requestConsentConfirmation()

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
    </ThemeProvider>
  )
}

export default App
