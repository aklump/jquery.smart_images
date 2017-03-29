#!/bin/bash
# 
# @file
# Copy relevent files from parent into demo
# 
rm -r "$7/demo/lib/jquery_smart_images/dist" || mkdir -p "$7/demo/lib/jquery_smart_images/dist"
rsync -av "$7/dist/" "$7/demo/lib/jquery_smart_images/dist/" --delete

# images folder
test -L "$7/demo/images" && rm "$7/demo/images"
test -e "$7/images/" && rsync -av "$7/images/" "$7/demo/images/" --delete
