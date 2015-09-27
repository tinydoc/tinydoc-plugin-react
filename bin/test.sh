#!/usr/bin/env bash

if [ ! -d "./node_modules" ]; then
  echo "$1 must be run from tinydoc-plugin-react's root."
  exit 1
fi

./node_modules/mocha/bin/mocha \
  --reporter min \
  lib/**/*.test.js \
  $@