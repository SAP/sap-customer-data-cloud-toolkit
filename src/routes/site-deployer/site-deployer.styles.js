/*
 * Copyright (c) 2023 SAP SE or an SAP affiliate company.
 * All rights reserved.
 *
 * This software is the confidential and proprietary information of SAP
 * ("Confidential Information"). You shall not disclose such Confidential
 * Information and shall use it only in accordance with the terms of the
 * license agreement you entered into with SAP.
 */

import { spacing } from '@ui5/webcomponents-react-base'

const styles = {
  titleStyle: {
    ...spacing.sapUiSmallMarginBegin,
  },
  titleSpanStyle: {
    ...spacing.sapUiTinyMarginBegin,
  },
  componentTextStyle: {
    color: 'var(--sapNeutralElementColor)',
  },
  outerDivStyle: {
    composes: 'cdc-tools-background',
    overflow: 'scroll',
    height: 'calc(100vh - 100px)',
  },
  headerOuterDivStyle: {
    ...spacing.sapUiSmallMargin,
  },
  headerInnerDivStyle: {
    ...spacing.sapUiTinyMargin,
  },
  headerTextFlexboxStyle: {
    ...spacing.sapUiSmallMarginBottom,
  },
  cardFlexboxStyle: {
    ...spacing.sapUiSmallMargin,
    textAlign: 'left',
    width: '100%',
  },
  baseDomainLabelStyle: {
    ...spacing.sapUiTinyMarginTopBottom,
  },
  baseDomainInputStyle: {
    width: '100%',
  },
  dataCentersOuterDivStyle: {
    ...spacing.sapUiSmallMargin,
    textAlign: 'left',
    width: '100%',
  },
  dataCentersLabelStyle: {
    ...spacing.sapUiTinyMarginTopBottom,
  },
  dataCentersMultiComboBoxStyle: {
    width: '100%',
  },
  siteStructureOuterDivStyle: {
    ...spacing.sapUiSmallMargin,
    marginTop: 0,
    textAlign: 'left',
  },
  siteStructuresLabelStyle: {
    ...spacing.sapUiTinyMarginTopBottom,
  },
  siteStructureSelectStyle: {
    width: '100%',
  },
  siteCreationPreviewCardOuterDivStyle: {
    ...spacing.sapUiSmallMargin,
  },
  siteCreationPreviewCardInnerDivStyle: {
    ...spacing.sapUiTinyMargin,
  },
  saveCancelButtonsOuterDivStyle: { ...spacing.sapUiSmallMargin },
  saveCancelButtonsInnerDivStyle: { ...spacing.sapUiTinyMargin },
  createButtonOuterDivStyle: {
    textAlign: 'center',
  },
  createButtonBarStyle: {
    display: 'block',
    position: 'relative',
    margin: '0 0px -3px 0',
  },
  createButtonStyle: {
    display: 'block',
    position: 'absolute',
    left: 0,
    right: 0,
    margin: 0,
  },
  progressIndicatorStyle: {
    width: '98%',
    position: 'relative',
    margin: 'var(--_ui5_card_header_padding)',
  },
  errorListOuterDivStyle: {
    ...spacing.sapUiSmallMargin,
  },
  errorListInnerDivStyle: {
    ...spacing.sapUiTinyMargin,
  },
}

export default styles
