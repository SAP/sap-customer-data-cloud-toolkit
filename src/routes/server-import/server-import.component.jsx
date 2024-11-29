/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */
import { withTranslation } from 'react-i18next'
import React, { useState } from 'react'
import { createUseStyles } from 'react-jss'
import styles from './server-import.styles.js'
import { Card, CardHeader, Bar, Title, Text, TitleLevel, FlexBox, Grid, Button, Input, Option, Select, Form, FormItem, Label, FormGroup, TextArea } from '@ui5/webcomponents-react'

const useStyles = createUseStyles(styles, { name: 'Server Import' })
const PAGE_TITLE = 'Server Import'
const ServerImportComponent = ({ t }) => {
  const classes = useStyles()
  const [selectedOption, setSelectedOption] = useState('option1')
  const [formData, setFormData] = useState({
    accountName: '',
    accountKey: '',
    container: '',
    blob: '',
    readFile: '',
  })

  const formFields = {
    option1: [
      { name: 'Account Name', type: 'text', placeholder: 'Enter your Account Name' },
      { name: 'Account Key', type: 'text', placeholder: 'Enter your Account Key' },
      { name: 'Container', type: 'text', placeholder: 'Enter your Container' },
      { name: 'File Name Regex', type: 'text', placeholder: 'Enter your File Name Regex' },
      { name: 'Blob Prefix', type: 'text', placeholder: 'Enter your Blob Prefix' },
    ],
    option2: [
      { name: 'Bucket Name', type: 'text', placeholder: 'Enter your Bucket Name' },
      { name: 'Access Key', type: 'text', placeholder: 'Enter your Access Key' },
      { name: 'Secret Key', type: 'text', placeholder: 'Enter your Secret Key' },
      { name: 'Object Key Prefix', type: 'text', placeholder: 'Enter your Object Key Prefix' },
    ],
    option3: [{ name: 'field5', type: 'date', placeholder: 'Select date for Option 3' }],
  }

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value)
  }

  const handleInputChange = (event) => {
    const { name, value } = event.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  const handleSubmit = () => {
    console.log('Form Data:', formData)
  }

  return (
    <>
      <Card>
        <div className={classes.outerDiv}>
          <Title className={classes.titleContainer} level="H3">
            {PAGE_TITLE}
          </Title>

          <div id="container" style={{ maxWidth: '1500px', width: '800px', overflowX: 'auto' }}>
            <div className={classes.serverDropDown}>
              <Select onChange={handleOptionChange} className={classes.selectBox}>
                <Option value="option1">Azure</Option>
                <Option value="option2">Amazon</Option>
                <Option value="option3">SFTP</Option>
              </Select>
            </div>
            <Form title="Test Form" columnsS={2} columnsM={2} columnsL={2} columnsXL={2} labelSpanS={12} labelSpanM={12} labelSpanL={12} labelSpanXL={12}>
              <FormGroup>
                {formFields[selectedOption].map((field) => (
                  <FormItem key={field.name} label={<Label>{field.name}</Label>}>
                    <Input type={field.type} name={field.name} placeholder={field.placeholder} value={formData[field.name] || ''} onInput={handleInputChange} />
                  </FormItem>
                ))}
              </FormGroup>
            </Form>
          </div>
          <div>
            <Bar design="Footer" className={classes.createButtonBarStyle}>
              <Button onClick={handleSubmit} design="Emphasized" className={classes.createButtonStyle}>
                Submit
              </Button>
            </Bar>
          </div>
        </div>
      </Card>
    </>
  )
}

export default ServerImportComponent
