#!/usr/bin/env bash
#
# @file
# Remove generated files before all other build steps
#

# Remove the minified files so we ensure they get rebuilt
test -e "jquery.smart_images.min.js" && rm "jquery.smart_images.min.js"
test -e "demo/smart-images.js" && rm "demo/smart-images.js"
