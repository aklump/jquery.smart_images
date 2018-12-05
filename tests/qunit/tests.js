/**
 * @file
 * Tests provided against the SmartImages class.
 *
 * @ingroup smart_images
 * @{
 */

QUnit.test('Callback onInit is called when provided.', function(assert) {
  var done = assert.async();
  var $el = $(markupDefault);
  $el.smartImages({
    onInit: function() {
      assert.ok(true, 'onInit was called');
      done();
    }
  });
});

QUnit.test('All span elements are hidden on init.', function(assert) {
  var $el = $(markupDefault);
  $el.smartImages();
  assert.equal($el.find('span').eq(0).attr('style'), 'display: none;');
  assert.equal($el.find('span').eq(1).attr('style'), 'display: none;');
  assert.equal($el.find('span').eq(2).attr('style'), 'display: none;');
  assert.equal($el.find('span').eq(3).attr('style'), 'display: none;');
});


QUnit.test('Assert data-media converts to breakpoints correctly for normal use.', function(assert) {
  var $el = $(markupDefault);
  $el.smartImages();
  var bp = $el.data('breakpointX');
  var aliases = bp.aliases;
  assert.equal(aliases.length, 4);
  assert.equal(aliases[0], 'max-width:767px');
  assert.equal(aliases[1], '(min-width:768px) and (max-width:959px)');
  assert.equal(aliases[2], '(min-width:960px) and (max-width:1079px)');
  assert.equal(aliases[3], 'min-width:1080px');
});

QUnit.test('Assert data-media converts to breakpoints correctly when no mobile.', function(assert) {
  var $el = $(markupSpanOrderIsDirty);
  $el.smartImages({
    dataPrefix: '',
    dataSrcSuffix: 'no-retina-src',
    srcSelector: 'span'
  });
  var bp = $el.data('breakpointX');
  var aliases = bp.aliases;
  assert.equal(aliases.length, 3);
  assert.equal(aliases[0], '(min-width:768px) and (max-width:959px)');
  assert.equal(aliases[1], '(min-width:960px) and (max-width:1079px)');
  assert.equal(aliases[2], 'min-width:1080px');
});

QUnit.test('Assert BreakpointX and SmartImage objects attach to element.', function(assert) {
  var $el = $(markupDefault);
  $el.smartImages();
  assert.ok($el.data('smartImages'));
  assert.ok($el.data('breakpointX'));
});

QUnit.test('Able to detect version.', function(assert) {
  assert.ok($.fn.smartImages.version, 'Version is not empty.');
});

/**
 * HTML markup to use in the tests.
 *
 * @type {string}
 */
var markupSpanOrderIsDirty = '<div>\n' +
  '    <span data-media="(min-width:960px) and (max-width:1079px)"></span>\n' +
  '    <span data-media="(min-width:768px) and (max-width:959px)"></span>\n' +
  '    <span data-media="min-width:1080px"></span><img/>\n' +
  '  </div>';


/**
 * HTML markup to use in the tests.
 *
 * @type {string}
 */
var markupDefault = '<div>\n' +
  '    <span data-si-srcset="image.jpg" data-si-media="max-width:767px"></span>\n' +
  '    <span data-si-srcset="image.jpg" data-si-media="(min-width:768px) and (max-width:959px)"></span>\n' +
  '    <span data-si-srcset="image.jpg" data-si-media="(min-width:960px) and (max-width:1079px)"></span>\n' +
  '    <span data-si-srcset="image.jpg" data-si-media="min-width:1080px"></span><img/>\n' +
  '  </div>';
