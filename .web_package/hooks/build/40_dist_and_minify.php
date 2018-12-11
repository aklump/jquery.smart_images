<?php

/**
 * @file
 * Load a source file, replace tokens and save to dist folder.
 */

namespace AKlump\WebPackage;

$build
  ->loadFile('src/smart-images.js')
  ->replaceTokens()
  ->saveToDist()
  ->minifyFile('dist/smart-images.js')
  ->addFilesToScm([
    "dist/smart-images.js",
    "dist/smart-images.min.js",
  ])
  ->displayMessages();
