#!/usr/bin/env bash

./node_modules/.bin/prettier "*/**/*.js" --write
exit 0

# Have to change into the directory of the config file is not found.
(cd src && ../node_modules/.bin/prettier "*.js" --write)
(cd tests/qunit && ../../node_modules/.bin/prettier "*.js" --write)
