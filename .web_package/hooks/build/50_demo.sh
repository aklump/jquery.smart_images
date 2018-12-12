#!/bin/bash
#
# @file
# Create the docs folder, which is the public demo on GitHub
#
wp_rm docs
mkdir docs
wp_duplicate "demo/images" "docs/images"
wp_duplicate "dist/jquery.smart-images.js" "docs/jquery.smart-images.js"
wp_duplicate "demo/package.json" "docs/package.json"
wp_duplicate "src/jquery.smart-images.js" "docs/jquery.smart-images.js"
cd docs && yarn
