/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */
import { withTranslation } from 'react-i18next'
import React from 'react'
import { createUseStyles } from 'react-jss'
import styles from './server-import.styles.js'

import { Card, CardHeader, Bar, Title, Text, TitleLevel, FlexBox, Grid, Button, Input, Option, Select } from '@ui5/webcomponents-react'

const useStyles = createUseStyles(styles, { name: 'Server Import' })
const PAGE_TITLE = 'Server Import'
const ServerImportComponent = ({ t }) => {
  const classes = useStyles()

  return (
    <>
      <Card>
        <div className={classes.outerDiv}>
          <CardHeader titleText="Import Server Data" />
          <Select className={classes.selectBox}>
            <Option value="option1">Option 1</Option>
            <Option value="option2">Option 2</Option>
            <Option value="option3">Option 3</Option>
          </Select>
          <div className={classes.formContainer}>
            <Title level="H6">Account Name</Title>
            <Input placeholder="Input 1" className={classes.input} />
            <Title level="H6">Account Key</Title>
            <Input placeholder="Input 2" className={classes.input} />
            <Title level="H6">Container</Title>
            <Input placeholder="Input 3" className={classes.input} />
            <Title level="H6">Blob Prefix</Title>
            <Input placeholder="Input 4" className={classes.input} />
            <Title level="H6">Read File</Title>
            <Input placeholder="Input 5" className={classes.input} />
          </div>
          <Button design="Emphasized" className={classes.submitButton}>
            Submit
          </Button>
        </div>
      </Card>
    </>
  )
}

export default withTranslation()(ServerImportComponent)
