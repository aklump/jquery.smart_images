#!/bin/bash
#
# @file
# Create the docs folder, which is the public demo on GitHub
#
(cd demo && yarn)

wp_rm docs
mkdir docs
wp_duplicate "demo/images" "docs/images"
wp_duplicate "dist/jquery.smart-images.js" "docs/jquery.smart-images.js"
wp_duplicate "demo/package.json" "docs/package.json"

# We commit node_modules because this is used on GitHub as the /docs.
(cd docs && yarn && git add -f node_modules)
