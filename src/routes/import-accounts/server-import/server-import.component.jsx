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

          <div className={classes.formContainer}>
            <Form labelSpanL={12}>
              <FormItem className={classes.formItem}>
                <Select className={classes.selectBox}>
                  <Option value="option1">Amazon S3</Option>
                  <Option value="option2">Azure</Option>
                  <Option value="option3">SFTP</Option>
                </Select>
              </FormItem>
              <FormItem className={classes.formItem}>
                <Label required for="nameInp" className={classes.label}>
                  Account Name:
                </Label>
                <Input id="nameInp" name="accountName" value={formData.accountName} onChange={handleInputChange} className={classes.input} />
              </FormItem>

              <FormItem className={classes.formItem}>
                <Label for="addressInp" className={classes.label}>
                  Account Key:
                </Label>
                <Input id="addressInp" name="accountKey" value={formData.accountKey} onChange={handleInputChange} className={classes.input} />
              </FormItem>

              <FormItem className={classes.formItem}>
                <Label required for="containerInp" className={classes.label}>
                  Container:
                </Label>
                <Input id="containerInp" name="container" value={formData.container} onChange={handleInputChange} className={classes.input} />
              </FormItem>

              <FormItem className={classes.formItem}>
                <Label for="blobInp" className={classes.label}>
                  Blob:
                </Label>
                <Input id="blobInp" name="blob" value={formData.blob} onChange={handleInputChange} className={classes.input} />
              </FormItem>

              <FormItem className={classes.formItem}>
                <Label for="readFileInp" className={classes.label}>
                  Read File:
                </Label>
                <Input id="readFileInp" name="readFile" value={formData.readFile} onChange={handleInputChange} className={classes.input} />
              </FormItem>
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

export default withTranslation()(ServerImportComponent)
