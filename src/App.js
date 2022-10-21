import { ThemeProvider } from '@ui5/webcomponents-react'

import SiteDeployer from './routes/site-deployer/site-deployer.component'
import CopyConfigurationExtended from './routes/copy-configuration-extended/copy-configuration-extended.component'
import { ROUTE_CONTAINER_CLASS, TAB_SITE_DEPLOYER } from './inject/constants'

import './App.css'

function App() {
  return (
    <ThemeProvider>
      <div className="App">
        <div className={ROUTE_CONTAINER_CLASS} name={TAB_SITE_DEPLOYER}>
          <SiteDeployer />
        </div>
        <CopyConfigurationExtended />
      </div>
    </ThemeProvider>
  )
}

export default App
