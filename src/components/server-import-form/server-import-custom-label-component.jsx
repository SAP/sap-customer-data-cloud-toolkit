import React from 'react'
import { Label } from '@ui5/webcomponents-react'

const CustomLabel = ({ name }) => {
  const parts = name.split('*')
  return (
    <Label>
      {parts[0]}
      {parts.length > 1 && <span style={{ color: 'red' }}>*</span>}
      {parts[1]}
    </Label>
  )
}

export default CustomLabel
