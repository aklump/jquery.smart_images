#!/usr/bin/env bash

node_modules/.bin/uglifyjs --comments --compress --mangle --output=dist/smart-images.min.js -- dist/smart-images.js
