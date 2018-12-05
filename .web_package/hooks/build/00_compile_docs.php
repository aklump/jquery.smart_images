<?php

namespace AKlump\WebPackage;

$build
  ->generateDocumentation()
  ->loadFile('README.md')
  ->replaceTokens([
    'images/smart-images.jpg' => 'docs/images/smart-images.jpg',
  ])
  ->saveReplacingSourceFile()
  ->addFilesToScm([
    'README.md',
    'CHANGELOG.md',
  ])
  ->displayMessages();
