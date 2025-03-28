/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */

import React from 'react'
import { Icon, Popover } from '@ui5/webcomponents-react'
import MessagePopoverButton from '../message-popover-button/message-popover-button.component.jsx'
import { getHighestSeverity } from '../configuration-tree/utils.js'

const TreeNodeTooltip = ({ treeNode, t, classes, onMouseOverHandler, onMouseOutHandler, openPopover }) => {
  return (
    <>
      {treeNode.tooltip && (
        <>
          <Icon
            id={`${treeNode.id}TooltipIcon`}
            name="message-information"
            design="Neutral"
            onMouseOver={onMouseOverHandler}
            onMouseOut={onMouseOutHandler}
            className={classes.tooltipIconStyle}
          />
          <Popover id={`${treeNode.id}Popover`} opener={`${treeNode.id}TooltipIcon`} open={openPopover(treeNode.id)}>
            {t(`${treeNode.tooltip}`)}
          </Popover>
        </>
      )}
      {treeNode.error && <MessagePopoverButton message={treeNode.error} type={getHighestSeverity(treeNode.error)} />}
    </>
  )
}

export default TreeNodeTooltip
