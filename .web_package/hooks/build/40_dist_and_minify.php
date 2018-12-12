<?php

/**
 * @file
 * Load a source file, replace tokens and save to dist folder.
 */

namespace AKlump\WebPackage;

$build
  ->loadFile('src/jquery.smart-images.js')
  ->replaceTokens()
  ->saveToDist()
  ->minifyFile('dist/jquery.smart-images.js')
  ->addFilesToScm([
    "dist/jquery.smart-images.js",
    "dist/jquery.smart-images.min.js",
  ])
  ->displayMessages();
