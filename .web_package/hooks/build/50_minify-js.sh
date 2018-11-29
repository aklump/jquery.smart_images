#!/usr/bin/env bash

"$7/node_modules/.bin/uglifyjs" --comments --compress --mangle --output=smart-images.min.js -- smart-images.js
