/*
 * Copyright (c) 2023 SAP SE or an SAP affiliate company.
 * All rights reserved.
 *
 * This software is the confidential and proprietary information of SAP
 * ("Confidential Information"). You shall not disclose such Confidential
 * Information and shall use it only in accordance with the terms of the
 * license agreement you entered into with SAP.
 */

const styles = {
  responsivePopoverStyle: {
    minWidth: 300,
  },
  badgeStyle: {
    margin: '0',
    padding: '0',
    background: 'var(--sapContent_BadgeBackground, #d04343)',
    border: 'var(--sapContent_BadgeBackground, #d04343)',
    color: '#fff',
    position: 'absolute',
    right: '7px',
    top: '1px',
    minWidth: '14px',
    pointerEvents: 'none',
    zIndex: '6',
    fontWeight: '400',
  },
}
export default styles
