<?php

/**
 * @file
 * Load a source file, replace tokens and save to dist folder.
 */

namespace AKlump\WebPackage;

$build
  ->loadFile('demo/index.html')
  ->replaceTokens()
  ->saveTo('docs')
  ->loadFile('demo/no-mobile.html')
  ->replaceTokens()
  ->saveTo('docs')
  ->displayMessages();
