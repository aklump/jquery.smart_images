#!/bin/bash
#
# @file
# Copy distribution files to /dist
#
# Allow time for all CodeKit to minify.
while [ ! -f "$7/jquery.smart_images.min.js" ]; do
  sleep 1
done

test -h "$7/dist" && rm "$7/dist"
test -d "$7/dist" || mkdir -p "$7/dist"

# Javascript
cp "$7/jquery.smart_images.js" "$7/dist/"
cp "$7/jquery.smart_images.min.js" "$7/dist/"

# External libraries
rsync -av --delete "$7/lib/" "$7/dist/lib/"
