/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */

import StringPrettierFormatter from './prettierFunction.js'
import { credentials, expectedGigyaResponseOk, expectedPrettierError } from '../servicesDataTest.js'
import { mockErrorScreenSets, mockGetAllSuccessScreenSets } from '../copyConfig/screenset/dataTest.js'
import axios from 'axios'
import { getResponseWithContext } from '../copyConfig/dataTest.js'
jest.mock('axios')
describe('Prettier Formatter Test Suite', () => {
  const targetApiKey = 'targetApiKey'
  const dataCenter = 'us1'
  const prettify = new StringPrettierFormatter(credentials, targetApiKey, dataCenter)
  const testString = `{
  // Called when an error occurs.
  onError: function (event) {
  				console.log("An error occurred:", event);
  			alert("Something went wrong! Please try again.");
  
  var errorMessage = event.message;
  console.error("Error message: ", errorMessage);
  },

  // Called before validation of the form.
  onBeforeValidation: function (event) {
  											console.log("Validation starting:", event);
  alert("Starting validation process...");

  if(event.hasOwnProperty('formData')){
      console.log("Form data exists");
  }
  },

  // Called before a form is submitted. This event gives you an opportunity to perform certain actions before the form is submitted, or cancel the submission by returning false.
  onBeforeSubmit: function (event) {
  														console.log("Form will be submitted:", event); 
  alert("Form is about to be submitted");

  if (!event.isValid) {
  																	console.warn("Form validation failed");
  												return false;
  }
  return true;
  },

  // Called when a form is submitted, can return a value or a promise. This event gives you an opportunity to modify the form data when it is submitted.
  onSubmit: function (event) {
  													var formData = event.formData;
  console.log("Form data submitted:", formData);

  formData.submittedAt = new Date(); 
  alert("Form data has been captured");

  														return formData;
  },

  // Called after a form is submitted.
  onAfterSubmit: function (event) {
  console.log("Form has been submitted:", event);
  alert("Thank you! Your form has been submitted successfully.");
  },

  // Called before a new screen is rendered. This event gives you an opportunity to cancel the navigation by returning false.
  onBeforeScreenLoad: function (event) {
  console.log("Screen is about to load:", event);
  alert("Loading new screen...");

  if(event.shouldCancel){
  console.warn("Navigation cancelled");
  return false;
  }
  return true;
  },

  // Called after a new screen is rendered.
  onAfterScreenLoad: function (event) {
  console.log("Screen has been loaded:", event);
  alert("New screen has been successfully loaded.");
  },

  // Called when a field is changed in a managed form.
  onFieldChanged: function (event) {
  var fieldName = event.fieldName;
  console.log("Field changed:", fieldName);
  alert("Field '" + fieldName + "' has been updated.");

  										if(fieldName === 'email'){
  															console.log("Email field was updated.");
  }
  },

  // Called when a user clicks the "X" (close) button or the screen is hidden following the end of the flow.
  onHide: function (event) {
  console.log("Screen is being hidden:", event);
  alert("Screen will be hidden now.");
  },

  // Called when a user clicks a custom button.
  					onButtonClicked: function (event) {
  				console.log("Custom button clicked:", event); 
  				alert("You clicked a custom button.");

  if(event.buttonId === 'submit'){
  console.log("Submit button was clicked.");
  }
  }
}`

  // Define the expected output after formatting
  const expectedString = `{
    // Called when an error occurs.
    onError: function (event) {
        console.log("An error occurred:", event);
        alert("Something went wrong! Please try again.");

        var errorMessage = event.message;
        console.error("Error message: ", errorMessage);
    },

    // Called before validation of the form.
    onBeforeValidation: function (event) {
        console.log("Validation starting:", event);
        alert("Starting validation process...");

        if (event.hasOwnProperty("formData")) {
            console.log("Form data exists");
        }
    },

    // Called before a form is submitted. This event gives you an opportunity to perform certain actions before the form is submitted, or cancel the submission by returning false.
    onBeforeSubmit: function (event) {
        console.log("Form will be submitted:", event);
        alert("Form is about to be submitted");

        if (!event.isValid) {
            console.warn("Form validation failed");
            return false;
        }
        return true;
    },

    // Called when a form is submitted, can return a value or a promise. This event gives you an opportunity to modify the form data when it is submitted.
    onSubmit: function (event) {
        var formData = event.formData;
        console.log("Form data submitted:", formData);

        formData.submittedAt = new Date();
        alert("Form data has been captured");

        return formData;
    },

    // Called after a form is submitted.
    onAfterSubmit: function (event) {
        console.log("Form has been submitted:", event);
        alert("Thank you! Your form has been submitted successfully.");
    },

    // Called before a new screen is rendered. This event gives you an opportunity to cancel the navigation by returning false.
    onBeforeScreenLoad: function (event) {
        console.log("Screen is about to load:", event);
        alert("Loading new screen...");

        if (event.shouldCancel) {
            console.warn("Navigation cancelled");
            return false;
        }
        return true;
    },

    // Called after a new screen is rendered.
    onAfterScreenLoad: function (event) {
        console.log("Screen has been loaded:", event);
        alert("New screen has been successfully loaded.");
    },

    // Called when a field is changed in a managed form.
    onFieldChanged: function (event) {
        var fieldName = event.fieldName;
        console.log("Field changed:", fieldName);
        alert("Field '" + fieldName + "' has been updated.");

        if (fieldName === "email") {
            console.log("Email field was updated.");
        }
    },

    // Called when a user clicks the "X" (close) button or the screen is hidden following the end of the flow.
    onHide: function (event) {
        console.log("Screen is being hidden:", event);
        alert("Screen will be hidden now.");
    },

    // Called when a user clicks a custom button.
    onButtonClicked: function (event) {
        console.log("Custom button clicked:", event);
        alert("You clicked a custom button.");

        if (event.buttonId === "submit") {
            console.log("Submit button was clicked.");
        }
    },
};
`
  test('Should format a messy string of code to a prettier version', async () => {
    const result = await prettify.myFormat(testString)
    expect(result).toBe(expectedString)
  })
  test('Should prettified all the screenSets successfully', async () => {
    const expectedResponse = mockGetAllSuccessScreenSets
    const serverResponse = expectedGigyaResponseOk
    let spy = jest.spyOn(prettify, 'set')
    axios
      .mockResolvedValueOnce({ data: expectedResponse })
      .mockResolvedValueOnce({ data: getResponseWithContext(serverResponse, expectedResponse.screenSets[0].screenSetID, targetApiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(serverResponse, expectedResponse.screenSets[1].screenSetID, targetApiKey) })
      .mockResolvedValueOnce({ data: getResponseWithContext(serverResponse, expectedResponse.screenSets[2].screenSetID, targetApiKey) })
    const result = await prettify.prettierCode(targetApiKey, undefined)
    expect(result.screenSetArray.length).toBe(3)
    expect(result.success).toBe(true)
    expect(spy.mock.calls.length).toBe(3)
  })
  test('Should prettified single screenSets successfully', async () => {
    const expectedResponse = mockGetAllSuccessScreenSets
    const serverResponse = expectedGigyaResponseOk
    axios
      .mockResolvedValueOnce({ data: expectedResponse })
      .mockResolvedValueOnce({ data: getResponseWithContext(serverResponse, expectedResponse.screenSets[0].screenSetID, targetApiKey) })
    const result = await prettify.prettierCode(targetApiKey, expectedResponse.screenSets[0].screenSetID)
    expect(result.screenSetArray.length).toBe(1)
    expect(result.success).toBe(true)
  })
  test('Should send an error on all', async () => {
    const expectedResponse = mockErrorScreenSets
    const serverResponse = expectedPrettierError
    axios
      .mockResolvedValueOnce({ data: expectedResponse })
      .mockResolvedValueOnce({ data: getResponseWithContext(serverResponse, expectedResponse.screenSets[0].screenSetID, targetApiKey) })

    const result = await prettify.prettierCode(targetApiKey, undefined)
    expect(result.success).toBe(false)
    expect(result.screenSetArray.length).toBe(0)
  })
  test('Should not prettify all screenSets without javascript', async () => {
    const expectedResponse = mockGetAllSuccessScreenSets

    removeJavascript(mockGetAllSuccessScreenSets)
    const serverResponse = expectedPrettierError
    axios
      .mockResolvedValueOnce({ data: expectedResponse })
      .mockResolvedValueOnce({ data: getResponseWithContext(serverResponse, expectedResponse.screenSets[0].screenSetID, targetApiKey) })

    const result = await prettify.prettierCode(targetApiKey, undefined)
    expect(result.error).toBe('There is no Javascript on any screen')
  })

  function removeJavascript(response) {
    for (const screenSet of response.screenSets) {
      delete screenSet.javascript
    }
    return response
  }
})
