import { ThemeProvider } from '@ui5/webcomponents-react'

import SiteDeployer from './routes/site-deployer/site-deployer.component'
import CopyConfigurationExtended from './routes/copy-configuration-extended/copy-configuration-extended.component'

import './App.css'

function App() {
  return (
    <ThemeProvider>
      <div className="App">
        <SiteDeployer />
        <CopyConfigurationExtended />
      </div>
    </ThemeProvider>
  )
}

export default App
