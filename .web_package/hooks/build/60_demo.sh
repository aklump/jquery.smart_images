#!/bin/bash
#
# @file
# Copy relevent files from parent into demo
#
[[ -e demo/smart-images.js ]] && rm demo/smart-images.js
cp dist/smart-images.js demo/
cd demo && yarn
