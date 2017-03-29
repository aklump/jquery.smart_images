#!/usr/bin/env bash
#
# @file
# This will create symlinks from the dist folder to the main during development.
#

# Javascript
cd "$7/dist" && rm jquery.smart_images.js && ln -s "$7/jquery.smart_images.js" .
test -e "$7/jquery.smart_images.min.js" && cd "$7/dist" && rm jquery.smart_images.min.js && ln -s "$7/jquery.smart_images.min.js" .

# CSS
test -e "$7/smart_images.css" && cd "$7/dist" && rm smart_images.css && ln -s "$7/smart_images.css" .
test -e "$7/smart_images_style.css" && cd "$7/dist" && rm smart_images_skin.css && ln -s "$7/smart_images_style.css" .

# Asset folders e.g., images
cd "$7/dist" && rm -r lib && ln -s "$7/lib" .

# External libraries
cd "$7/dist" && rm -r images && ln -s "$7/images" .




