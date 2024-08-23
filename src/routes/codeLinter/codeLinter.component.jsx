/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */
import { withTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import React from 'react'
import { Bar, Button } from '@ui5/webcomponents-react'
import { createUseStyles } from 'react-jss'
import styles from './email-templates.styles.js'
import StringPrettierFormatter from '../../services/prettierValidator/prettierFunction.js'
import { selectCredentials } from '../../redux/credentials/credentialsSlice'
import { getApiKey, getScreenSet } from '../../redux/utils.js'

const useStyles = createUseStyles(styles, { name: 'Prettier' })

const CodeMirrorEditor = ({ t }) => {
  const classes = useStyles()
  const credentials = useSelector(selectCredentials)
  const apikey = getApiKey(window.location.hash)
  const credentialsUpdated = { userKey: credentials.userKey, secret: credentials.secretKey, gigyaConsole: 'console.gigya.com' }
  //Encontrar maneira de ir buscar o dataCenter de forma dinamica
  const prettier = new StringPrettierFormatter(credentialsUpdated, apikey, 'us1')
  const getCurrentCode = () => {
    let mainApp = document.querySelector('main-app')

    let shadowRoot = mainApp.shadowRoot
    let screenSet = shadowRoot.querySelector('app-root')
    let iframe = screenSet.querySelector('iframe.console-app-iframe')

    let iframeDocument = iframe.contentDocument || iframe.contentWindow.document
    if (!iframeDocument) {
      console.log("iframe couldn't be found in DOM.")
    }
    let mainAppIframe = iframeDocument.querySelectorAll('#screenSet')
    let playground = mainAppIframe[0].querySelectorAll('#playground')
    let codeMirror = playground[0].querySelectorAll('.CodeMirror-sizer')
    let code = codeMirror[0].querySelectorAll('.CodeMirror-code')

    let preElements = code[0].querySelectorAll('pre.CodeMirror-line')
    let codeLines = []
    preElements.forEach((pre) => {
      let lineText = pre.textContent || pre.innerText || ''
      codeLines.push(lineText)
    })
    let combinedCode = codeLines.join('\n')
    console.log('Combined Code:', combinedCode)
    return combinedCode
  }
  const getServices = async () => {
    const currentCode = getCurrentCode()
    const screenSet = getScreenSet(window.location)
    console.log('Original apikey:', apikey)
    console.log('Original credentials:', credentials)
    console.log('Original apiKey:', await prettier.prettierCode(screenSet, apikey, currentCode))
    console.log('Original screenSet:', screenSet)
    console.log('Original currentCode:', currentCode)
    setTimeout(() => {
      window.location.reload()
    }, 5000)
    console.log('window.location.hash', window.location)
    // console.log('Original apiKey:', prettier)
    //   console.log(
    //     'prettier',
    //     await StringPrettierFormatter.myFormat(`{
    //   // Called when an error occurs.
    //   onError: function (event) {
    //           console.log("An error occurred:", event);
    //         alert("Something went wrong! Please try again.");

    //   var errorMessage = event.message;
    //   console.error("Error message: ", errorMessage);
    //   },

    //   // Called before validation of the form.
    //   onBeforeValidation: function (event) {
    //                         console.log("Validation starting:", event);
    //   alert("Starting validation process...");

    //   if(event.hasOwnProperty('formData')){
    //       console.log("Form data exists");
    //   }
    //   },

    //   // Called before a form is submitted. This event gives you an opportunity to perform certain actions before the form is submitted, or cancel the submission by returning false.
    //   onBeforeSubmit: function (event) {
    //                               console.log("Form will be submitted:", event);
    //   alert("Form is about to be submitted");

    //   if (!event.isValid) {
    //                                     console.warn("Form validation failed");
    //                           return false;
    //   }
    //   return true;
    //   },

    //   // Called when a form is submitted, can return a value or a promise. This event gives you an opportunity to modify the form data when it is submitted.
    //   onSubmit: function (event) {
    //                             var formData = event.formData;
    //   console.log("Form data submitted:", formData);

    //   formData.submittedAt = new Date();
    //   alert("Form data has been captured");

    //                               return formData;
    //   },

    //   // Called after a form is submitted.
    //   onAfterSubmit: function (event) {
    //   console.log("Form has been submitted:", event);
    //   alert("Thank you! Your form has been submitted successfully.");
    //   },

    //   // Called before a new screen is rendered. This event gives you an opportunity to cancel the navigation by returning false.
    //   onBeforeScreenLoad: function (event) {
    //   console.log("Screen is about to load:", event);
    //   alert("Loading new screen...");

    //   if(event.shouldCancel){
    //   console.warn("Navigation cancelled");
    //   return false;
    //   }
    //   return true;
    //   },

    //   // Called after a new screen is rendered.
    //   onAfterScreenLoad: function (event) {
    //   console.log("Screen has been loaded:", event);
    //   alert("New screen has been successfully loaded.");
    //   },

    //   // Called when a field is changed in a managed form.
    //   onFieldChanged: function (event) {
    //   var fieldName = event.fieldName;
    //   console.log("Field changed:", fieldName);
    //   alert("Field '" + fieldName + "' has been updated.");

    //                       if(fieldName === 'email'){
    //                                 console.log("Email field was updated.");
    //   }
    //   },

    //   // Called when a user clicks the "X" (close) button or the screen is hidden following the end of the flow.
    //   onHide: function (event) {
    //   console.log("Screen is being hidden:", event);
    //   alert("Screen will be hidden now.");
    //   },

    //   // Called when a user clicks a custom button.
    //             onButtonClicked: function (event) {
    //           console.log("Custom button clicked:", event);
    //           alert("You clicked a custom button.");

    //   if(event.buttonId === 'submit'){
    //   console.log("Submit button was clicked.");
    //   }
    //   }
    // }`),
    //   )
  }

  return (
    <>
      <Bar
        className={classes.outerBarStyle}
        endContent={
          <Button id="importAllEmailTemplatesButton" data-cy="importAllEmailTemplatesButton" className={classes.importAllButtonStyle} onClick={getServices}>
            Edit Code
          </Button>
        }
      ></Bar>
    </>
  )
}

export default withTranslation()(CodeMirrorEditor)
