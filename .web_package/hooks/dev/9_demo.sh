#!/usr/bin/env bash

# Point demo dist to main dist
cd "$7/demo/" && rm jquery.smart_images.js && ln -s "$7/jquery.smart_images.js"
