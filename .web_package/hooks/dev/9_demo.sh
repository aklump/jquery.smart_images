#!/usr/bin/env bash

# Point demo dist to main dist
cd "docs/" && rm smart-images.js && ln -s "../src/smart-images.js"
