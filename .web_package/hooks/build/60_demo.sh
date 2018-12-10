#!/bin/bash
#
# @file
# Copy relevent files from parent into demo
#
[[ -e docs/smart-images.js ]] && rm docs/smart-images.js
cp dist/smart-images.js docs/
cd docs && yarn
