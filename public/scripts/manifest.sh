#!/usr/bin/env bash

#
# Copyright (c) 2023 SAP SE or an SAP affiliate company.
# All rights reserved.
#
# This software is the confidential and proprietary information of SAP
# ("Confidential Information"). You shall not disclose such Confidential
# Information and shall use it only in accordance with the terms of the
# license agreement you entered into with SAP.
#

# this script changes the version on the manifest file

sed -E -i '' "s/\"version\": \".*\",/\"version\": \"$1\",/g" public/manifest.json
