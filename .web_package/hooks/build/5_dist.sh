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

# External libraries
rsync -av --delete "$7/lib/" "$7/dist/lib/"
