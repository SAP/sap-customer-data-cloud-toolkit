import { ThemeProvider } from '@ui5/webcomponents-react'

import SiteDeployer from './routes/site-deployer/site-deployer.component'
import CopyConfigurationExtended from './routes/copy-configuration-extended/copy-configuration-extended.component'

import './App.css'

import logo from './logo.svg'

// function getLogo() {
//   if (window.chrome & window.chrome.runtime) {
//     return window.chrome.runtime.getURL(logo);
//   }

//   return logo;
// }

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
