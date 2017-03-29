#!/bin/bash
#
# @file
# Copy distribution files to /dist
#
sleep 3

(! test -e "$7/dist" || rm -r "$7/dist") && mkdir -p "$7/dist"

# Javascript
cp "$7/jquery.smart_images.js" "$7/dist/"
test -e "$7/jquery.smart_images.min.js" && cp "$7/jquery.smart_images.min.js" "$7/dist/"

# CSS
test -e "$7/smart_images.css" && cp "$7/smart_images.css" "$7/dist/"
test -e "$7/smart_images_skin.css" && cp "$7/smart_images_skin.css" "$7/dist/"

# Asset folders e.g., images
test -e "$7/images/" && rsync -av --delete "$7/images/" "$7/dist/images/"

# External libraries
rsync -av --delete "$7/lib/" "$7/dist/lib/"
