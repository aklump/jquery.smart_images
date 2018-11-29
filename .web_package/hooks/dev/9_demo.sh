#!/usr/bin/env bash

# Point demo dist to main dist
cd "$7/demo/" && rm smart-images.js && ln -s "$7/smart-images.js"
