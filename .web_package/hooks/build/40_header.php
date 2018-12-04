<?php
/**
 * @file
 * Embeds .info file information into the jquery plugin file itself.
 *
 * The header of the jquery file must look like the following example, line for
 *   line exact.
 *
 * Be sure to replace the $source_file with the correct filename
 */

// Here is the header required to use this script...
// Additional comments should come AFTER the date line.

/**
 * __title JavaScript Module v__version
 * __homepage
 *
 * __description
 *
 * Copyright 2013__year, __author
 *
 * @license Dual licensed under the MIT or GPL Version 2 licenses.
 *
 * Date: __date
 */

require_once dirname(__FILE__) . '/../../vendor/autoload.php';

try {
  cp_with_token_replacement($argv[7] . '/src/smart-images.js');
}
catch (\Exception $exception) {
  echo $exception->getMessage();
  exit(1);
}
exit(0);
