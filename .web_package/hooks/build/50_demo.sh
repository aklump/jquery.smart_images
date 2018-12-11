#!/bin/bash
#
# @file
# Create the docs folder, which is the public demo on GitHub
#
wp_rm docs
mkdir docs
wp_duplicate "demo/images" "docs/images"
wp_duplicate "dist/smart-images.js" "docs/smart-images.js"
wp_duplicate "demo/package.json" "docs/package.json"
cd docs && yarn
