#!/usr/bin/env bash

# this script changes the version on the manifest file

sed -E -i '' "s/\"version\": \".*\",/\"version\": \"$1\",/g" public/manifest.json
