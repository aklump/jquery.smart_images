#!/usr/bin/env bash

# Point demo dist to main dist
cd "$7/demo/lib/jquery_smart_images" && rm -r dist && ln -s "$7/dist" .

