#!/usr/bin/env bash
#
# @file
# Remove generated files before all other build steps
#

# Remove the minified files so we ensure they get rebuilt
test -e "$7/jquery.smart_images.min.js" && rm "$7/jquery.smart_images.min.js"

# Remove the dist folder
test -e "$7/demo/lib/jquery_smart_images/dist" && rm -rf "$7/demo/lib/jquery_smart_images/dist"
