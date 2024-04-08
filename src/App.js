/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */

/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */

import { ThemeProvider } from '@ui5/webcomponents-react'
import SiteDeployer from './routes/site-deployer/site-deployer.component'
import EmailTemplates from './routes/email-templates/email-templates.component'
import SmsTemplates from './routes/sms-templates/sms-templates.component'
import CopyConfigurationExtended from './routes/copy-configuration-extended/copy-configuration-extended.component'
import CredentialsPopoverButton from './components/credentials-popover-button/credentials-popover-button.component'
import { ROUTE_CONTAINER_CLASS, ROUTE_SITE_DEPLOYER, ROUTE_EMAIL_TEMPLATES, ROUTE_SMS_TEMPLATES, ROUTE_COPY_CONFIG_EXTENDED, TOPBAR_MENU_CONTAINER_CLASS } from './inject/constants'
import './App.css'
import { find_sap_horizon_Theme } from './utils/themeFinder'
//import React, { useEffect } from 'react';
import React, { useEffect } from 'react';
import { setTheme } from '@ui5/webcomponents-base/dist/config/Theme';

function App() {
//*************** changes with observable *******************
useEffect(() => {
  const checkTheme = () => {
    const isSapHorizonTheme = find_sap_horizon_Theme();
    const elements = document.querySelectorAll('fd-busy-indicator .fd-shellbar .top-bar div .fd-shellbar');
    elements.forEach(element => {
      if (isSapHorizonTheme) {
        setTheme ("sap_horizon")
      } else {
        setTheme ("sap_fiori_3")
      }
    });
    // const htmlElement = document.documentElement;
    // if (isSapHorizonTheme) {
    //   htmlElement.classList.add('themeApplier');
    // } else {
    //   htmlElement.classList.remove('themeApplier');
    // }
  };

  const observer = new MutationObserver(checkTheme);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['href'],
    subtree: true,
  });

  checkTheme();

  return () => {
    observer.disconnect();
  };
}, []);
//*************** changes with observable *******************
// //*************** changes *******************
//   // const [currentTheme, setCurrentTheme] = useState('');
//   useEffect(() => {
//     // Function to detect the theme on component mount
//     const detectTheme = () => {
//       const isSapHorizonTheme = find_sap_horizon_Theme();
//       if (isSapHorizonTheme) {
//         console.log(isSapHorizonTheme);
//       } else {
//         console.log(isSapHorizonTheme);
//         // Do something if it's not sap_horizon theme
//       }
//     };
//     detectTheme(); // Call the function when component mounts
//     return () => {
//     };
//   }, []); 
// //*************** changes *******************
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
