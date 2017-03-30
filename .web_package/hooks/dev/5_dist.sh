#!/usr/bin/env bash
#
# @file
# This will create symlinks from the dist folder to the main during development.
#

# Javascript
cd "$7/dist" && rm jquery.smart_images.js && ln -s "$7/jquery.smart_images.js" .
test -e "$7/jquery.smart_images.min.js" && cd "$7/dist" && rm jquery.smart_images.min.js && ln -s "$7/jquery.smart_images.min.js" .


