#!/bin/bash
# 
# @file
# Copy relevent files from parent into demo
# 
mkdir -p "$7/demo/lib/jquery_smart_images/dist"
rsync -av "$7/dist/" "$7/demo/lib/jquery_smart_images/dist/" --delete
