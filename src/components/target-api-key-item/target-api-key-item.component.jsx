/*
 * Copyright (c) 2023 SAP SE or an SAP affiliate company.
 * All rights reserved.
 *
 * This software is the confidential and proprietary information of SAP
 * ("Confidential Information"). You shall not disclose such Confidential
 * Information and shall use it only in accordance with the terms of the
 * license agreement you entered into with SAP.
 */

import { withTranslation } from 'react-i18next'
import { createUseStyles } from 'react-jss'

import { Label, Text, FlexBox, CustomListItem } from '@ui5/webcomponents-react'

import MessagePopoverButton from '../../components/message-popover-button/message-popover-button.component'
import { getHighestSeverity } from '../configuration-tree/utils'

import styles from './target-api-key-item.styles'

const useStyles = createUseStyles(styles, { name: 'TargetApiKeyItem' })

const TargetApiKeyItem = ({ targetSite, t }) => {
  const classes = useStyles()
  return (
    <CustomListItem key={targetSite.apiKey} className={classes.targetSitesListItem} data-apikey={targetSite.apiKey}>
      <FlexBox>
        <table>
          <tbody>
            <tr>
              <td>
                <Label>{t('COPY_CONFIGURATION_EXTENDED.SITE_DOMAIN')}</Label>
              </td>
              <td>
                <Text>{targetSite.baseDomain}</Text>
              </td>
            </tr>
            <tr>
              <td>
                <Label>{t('COPY_CONFIGURATION_EXTENDED.API_KEY')}</Label>
              </td>
              <td>
                <Text>{targetSite.apiKey}</Text>
              </td>
            </tr>
            {targetSite.partnerName ? (
              <tr>
                <td>
                  <Label>{t('COPY_CONFIGURATION_EXTENDED.PARTNER')}</Label>
                </td>
                <td>
                  <Text>
                    {targetSite.partnerName} ({targetSite.partnerId})
                  </Text>
                </td>
              </tr>
            ) : (
              ''
            )}
          </tbody>
        </table>
      </FlexBox>
      {targetSite.error ? <MessagePopoverButton message={targetSite.error} type={getHighestSeverity(targetSite.error)} /> : ''}
    </CustomListItem>
  )
}

export default withTranslation()(TargetApiKeyItem)
