#!/usr/bin/env bash

# Point demo dist to main dist
cd "demo/" && rm smart-images.js && ln -s "../src/smart-images.js"
