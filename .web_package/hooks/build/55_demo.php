<?php

/**
 * @file
 * Load a source file, replace tokens and save to dist folder.
 */

namespace AKlump\WebPackage;

$tokens = [
  '../src/' => '',
];
$build
  ->loadFile('demo/index.html')
  ->replaceTokens($tokens)
  ->saveTo('docs')
  ->loadFile('demo/no-mobile.html')
  ->replaceTokens($tokens)
  ->saveTo('docs')
  ->addFilesToScm([
    "docs",
  ])
  ->displayMessages();
