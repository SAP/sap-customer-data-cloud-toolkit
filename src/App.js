import { ThemeProvider } from '@ui5/webcomponents-react'

// import { MultiComboBox, MultiComboBoxItem } from '@ui5/webcomponents-react'

// import SiteDeployer from './routes/site-deployer/site-deployer.component'
// import EmailTemplates from './routes/email-templates/email-templates.component'
// import CopyConfigurationExtended from './routes/copy-configuration-extended/copy-configuration-extended.component'
// import CredentialsPopoverButton from './components/credentials-popover-button/credentials-popover-button.component'

import {
  ROUTE_CONTAINER_CLASS,
  ROUTE_CONTAINER_SHOW_CLASS,
  ROUTE_SITE_DEPLOYER,
  // ROUTE_EMAIL_TEMPLATES,
  // ROUTE_COPY_CONFIG_EXTENDED,
  // TOPBAR_MENU_CONTAINER_CLASS,
} from './inject/constants'

import './App.css'

function App({ route }) {
  return (
    <ThemeProvider>
      <div className="App">
        <div className={`${ROUTE_CONTAINER_CLASS} ${ROUTE_CONTAINER_SHOW_CLASS}`} route={ROUTE_SITE_DEPLOYER}>
          1. {route} <br />
          {/* <MultiComboBox id="cdctools-dataCenter" style={{ width: '100%' }}>
          <MultiComboBoxItem key={1} text={1} selected />
          <MultiComboBoxItem key={2} text={2} selected />
          <MultiComboBoxItem key={3} text={3} selected />
        </MultiComboBox> */}
        </div>
        {/* <div className="App">
          1. {route} <br />
          2. {ROUTE_SITE_DEPLOYER} <br />
          {route === ROUTE_SITE_DEPLOYER ? (
            <div className={`${ROUTE_CONTAINER_CLASS} ${ROUTE_CONTAINER_SHOW_CLASS}`} route={ROUTE_SITE_DEPLOYER}>
              <SiteDeployer />
            </div>
          ) : (
            ''
          )}
          <div className={ROUTE_CONTAINER_CLASS} route={ROUTE_EMAIL_TEMPLATES}>
            <EmailTemplates />
          </div>
          <div className={ROUTE_CONTAINER_CLASS} route={ROUTE_COPY_CONFIG_EXTENDED}>
            <CopyConfigurationExtended />
          </div>
        </div>
        <div className={TOPBAR_MENU_CONTAINER_CLASS}>
          <CredentialsPopoverButton />
        </div> */}
      </div>
    </ThemeProvider>
  )
}

export default App
