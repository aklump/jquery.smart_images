<?php

namespace AKlump\WebPackage;

$build
  ->documentation([
    'README.md',
    'CHANGELOG.md',
  ])
  ->load('README.md')
  ->replace([
    'images/smart-images.jpg' => 'docs/images/smart-images.jpg',
  ])
  ->saveOverwrite()
  ->displayMessages();
