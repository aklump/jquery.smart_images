#!/usr/bin/env bash
#
# @file
# Remove generated files before all other build steps
#

[[ -f demo/smart-images.js ]] && rm -r demo/smart-images.js
[[ -d dist ]] && rm -r dist
mkdir dist
