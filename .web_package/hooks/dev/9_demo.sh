#!/usr/bin/env bash

# Point demo dist to main dist
cd "$7/demo/lib/jquery.smart_images" && rm -r dist && ln -s "$7/dist" .

# images folder
test -e "$7/demo/images" && rm -r "$7/demo/images"
test -e "$7/images" && cd "$7/demo" && ln -s "$7/images" .

