#!/usr/bin/env bash

[[ -d dist ]] && rm -r dist
mkdir dist
cp src/smart-images.js dist/
node_modules/.bin/uglifyjs --comments --compress --mangle --output=dist/smart-images.min.js -- dist/smart-images.js
