/**
 * @file
 * Tests provided against the SmartImages class.
 *
 * @ingroup smart_images
 * @{
 */


QUnit.test('Assert BreakpointX and SmartImage objects attach to element and can be destroyed.', function(assert) {
  var $el = $(markupDefault);
  $el.smartImages();
  assert.ok($el.data('smartImages'));
  assert.ok($el.data('breakpointX'));
  $el.smartImages('destroy');
  assert.notOk($el.data('smartImages'));
  assert.notOk($el.data('breakpointX'));
});

QUnit.test('Test a no mobile sequence using "always" initial small and classes are written, unwritten.', function(assert) {
  var $el = $(markupNoMobile),
    $img = $el.find('img'),
    small = 300,
    large = 500,
    jumbo = 800,
    className ='si-has-not-src';
  var bpx = $el.smartImages({
    downsize: 'always',
    initialWidth: small,
    resizeThrottle: 0
  }).data('breakpointX');
  assert.notOk($img.attr('src'));

  bpx.onWindowResize(large);
  assert.strictEqual($img.attr('src'), 'images/large.jpg');
  assert.notOk($el.hasClass(className));

  bpx.onWindowResize(jumbo);
  assert.strictEqual($img.attr('src'), 'images/jumbo.jpg');
  assert.notOk($el.hasClass(className));

  bpx.onWindowResize(large);
  assert.strictEqual($img.attr('src'), 'images/large.jpg');
  assert.notOk($el.hasClass(className));

  bpx.onWindowResize(small);
  assert.notOk($img.attr('src'));
  assert.ok($el.hasClass(className));

  bpx.onWindowResize(large);
  assert.strictEqual($img.attr('src'), 'images/large.jpg');
  assert.notOk($el.hasClass(className));

  bpx.onWindowResize(jumbo);
  assert.strictEqual($img.attr('src'), 'images/jumbo.jpg');
  assert.notOk($el.hasClass(className));

  bpx.onWindowResize(small);
  assert.notOk($img.attr('src'));
  assert.ok($el.hasClass(className));

  bpx.onWindowResize(large);
  assert.strictEqual($img.attr('src'), 'images/large.jpg');
  assert.notOk($el.hasClass(className));
});

QUnit.test('Test a sequence using "loaded" initial small.', function(assert) {
  var $el = $(markupDefault),
    $img = $el.find('img'),
    small = 200,
    medium = 800,
    large = 980,
    jumbo = 1200;
  var bpx = $el.smartImages({
    downsize: 'loaded',
    initialWidth: small,
    resizeThrottle: 0
  }).data('breakpointX');
  assert.strictEqual($img.attr('src'), 'small.jpg');

  bpx.onWindowResize(medium);
  assert.strictEqual($img.attr('src'), 'medium.jpg');

  bpx.onWindowResize(large);
  assert.strictEqual($img.attr('src'), 'large.jpg');

  bpx.onWindowResize(jumbo);
  assert.strictEqual($img.attr('src'), 'jumbo.jpg');

  bpx.onWindowResize(large);
  assert.strictEqual($img.attr('src'), 'large.jpg');

  bpx.onWindowResize(medium);
  assert.strictEqual($img.attr('src'), 'medium.jpg');

  bpx.onWindowResize(small);
  assert.strictEqual($img.attr('src'), 'small.jpg');

  bpx.onWindowResize(large);
  assert.strictEqual($img.attr('src'), 'large.jpg');
});

QUnit.test('Test a sequence using "loaded" initial jumbo.', function(assert) {
  var $el = $(markupDefault),
    $img = $el.find('img'),
    small = 200,
    medium = 800,
    large = 980,
    jumbo = 1200;
  var bpx = $el.smartImages({
    downsize: 'loaded',
    initialWidth: jumbo,
    resizeThrottle: 0
  }).data('breakpointX');
  assert.strictEqual($img.attr('src'), 'jumbo.jpg');

  bpx.onWindowResize(large);
  assert.strictEqual($img.attr('src'), 'jumbo.jpg');

  bpx.onWindowResize(medium);
  assert.strictEqual($img.attr('src'), 'jumbo.jpg');

  bpx.onWindowResize(small);
  assert.strictEqual($img.attr('src'), 'jumbo.jpg');

  bpx.onWindowResize(medium);
  assert.strictEqual($img.attr('src'), 'jumbo.jpg');

  bpx.onWindowResize(large);
  assert.strictEqual($img.attr('src'), 'jumbo.jpg');

  bpx.onWindowResize(jumbo);
  assert.strictEqual($img.attr('src'), 'jumbo.jpg');

  bpx.onWindowResize(medium);
  assert.strictEqual($img.attr('src'), 'jumbo.jpg');
});

QUnit.test('Test a sequence using "never" initial small.', function(assert) {
  var $el = $(markupDefault),
    $img = $el.find('img'),
    small = 200,
    medium = 800,
    large = 980,
    jumbo = 1200;
  var bpx = $el.smartImages({
    downsize: 'never',
    initialWidth: small,
    resizeThrottle: 0
  }).data('breakpointX');
  assert.strictEqual($img.attr('src'), 'small.jpg');

  bpx.onWindowResize(medium);
  assert.strictEqual($img.attr('src'), 'medium.jpg');

  bpx.onWindowResize(large);
  assert.strictEqual($img.attr('src'), 'large.jpg');

  bpx.onWindowResize(jumbo);
  assert.strictEqual($img.attr('src'), 'jumbo.jpg');

  bpx.onWindowResize(large);
  assert.strictEqual($img.attr('src'), 'jumbo.jpg');

  bpx.onWindowResize(medium);
  assert.strictEqual($img.attr('src'), 'jumbo.jpg');

  bpx.onWindowResize(small);
  assert.strictEqual($img.attr('src'), 'jumbo.jpg');

  bpx.onWindowResize(large);
  assert.strictEqual($img.attr('src'), 'jumbo.jpg');
});

QUnit.test('Test a sequence using "never" initial jumbo.', function(assert) {
  var $el = $(markupDefault),
    $img = $el.find('img'),
    small = 200,
    medium = 800,
    large = 980,
    jumbo = 1200;
  var bpx = $el.smartImages({
    downsize: 'never',
    initialWidth: jumbo,
    resizeThrottle: 0
  }).data('breakpointX');
  assert.strictEqual($img.attr('src'), 'jumbo.jpg');

  bpx.onWindowResize(large);
  assert.strictEqual($img.attr('src'), 'jumbo.jpg');

  bpx.onWindowResize(medium);
  assert.strictEqual($img.attr('src'), 'jumbo.jpg');

  bpx.onWindowResize(small);
  assert.strictEqual($img.attr('src'), 'jumbo.jpg');

  bpx.onWindowResize(medium);
  assert.strictEqual($img.attr('src'), 'jumbo.jpg');

  bpx.onWindowResize(large);
  assert.strictEqual($img.attr('src'), 'jumbo.jpg');

  bpx.onWindowResize(jumbo);
  assert.strictEqual($img.attr('src'), 'jumbo.jpg');

  bpx.onWindowResize(medium);
  assert.strictEqual($img.attr('src'), 'jumbo.jpg');
});

QUnit.test('Test a sequence using "always" initial small.', function(assert) {
  var $el = $(markupDefault),
    $img = $el.find('img'),
    small = 200,
    medium = 800,
    large = 980,
    jumbo = 1200;
  var bpx = $el.smartImages({
    downsize: 'always',
    initialWidth: small,
    resizeThrottle: 0
  }).data('breakpointX');
  assert.strictEqual($img.attr('src'), 'small.jpg');

  bpx.onWindowResize(medium);
  assert.strictEqual($img.attr('src'), 'medium.jpg');

  bpx.onWindowResize(large);
  assert.strictEqual($img.attr('src'), 'large.jpg');

  bpx.onWindowResize(jumbo);
  assert.strictEqual($img.attr('src'), 'jumbo.jpg');

  bpx.onWindowResize(large);
  assert.strictEqual($img.attr('src'), 'large.jpg');

  bpx.onWindowResize(medium);
  assert.strictEqual($img.attr('src'), 'medium.jpg');

  bpx.onWindowResize(small);
  assert.strictEqual($img.attr('src'), 'small.jpg');

  bpx.onWindowResize(large);
  assert.strictEqual($img.attr('src'), 'large.jpg');
});

QUnit.test('Test a sequence using "always" initial jumbo.', function(assert) {
  var $el = $(markupDefault),
    $img = $el.find('img'),
    small = 200,
    medium = 800,
    large = 980,
    jumbo = 1200;
  var bpx = $el.smartImages({
    downsize: 'always',
    initialWidth: jumbo,
    resizeThrottle: 0
  }).data('breakpointX');
  assert.strictEqual($img.attr('src'), 'jumbo.jpg');

  bpx.onWindowResize(large);
  assert.strictEqual($img.attr('src'), 'large.jpg');

  bpx.onWindowResize(medium);
  assert.strictEqual($img.attr('src'), 'medium.jpg');

  bpx.onWindowResize(small);
  assert.strictEqual($img.attr('src'), 'small.jpg');

  bpx.onWindowResize(medium);
  assert.strictEqual($img.attr('src'), 'medium.jpg');

  bpx.onWindowResize(large);
  assert.strictEqual($img.attr('src'), 'large.jpg');

  bpx.onWindowResize(jumbo);
  assert.strictEqual($img.attr('src'), 'jumbo.jpg');

  bpx.onWindowResize(medium);
  assert.strictEqual($img.attr('src'), 'medium.jpg');
});

QUnit.test(
  'Calling with string method name triggers method and updates src.',
  function(assert) {
    var beforeWasCalled = assert.async(2);
    var $el = $(markupDefault),
      $img = $el.find('img');
    $el.smartImages({
      onBeforeChange: function() {
        assert.ok(true);
        beforeWasCalled();
      },
    });
    $img.removeAttr('src');
    $el.smartImages('changeHandler');
    assert.ok($img.attr('src'));
  }
);

QUnit.test(
  'Return false from onBeforeChange prevents img src from loading.',
  function(assert) {
    var $el = $(markupDefault);
    assert.notOk($el.find('img').attr('src'));
    $el.smartImages({
      onBeforeChange: function() {
        return false;
      },
    });
    $el.smartImages('changeHandler');
    assert.notOk($el.find('img').attr('src'));
  }
);

QUnit.test('img.src is empty to start and still empty onBeforeChange', function(
  assert
) {
  var before = assert.async(1);
  var $el = $(markupDefault);
  assert.notOk($el.find('img').attr('src'));
  $el.smartImages({
    onBeforeChange: function() {
      assert.notOk($el.find('img').attr('src'));
      before();
    },
  });
});

QUnit.test(
  'img.src is empty then matches the src passed to onAfterChange',
  function(assert) {
    var done = assert.async(1);
    var $el = $(markupDefault);
    assert.notOk($el.find('img').attr('src'));
    $el.smartImages({
      onAfterChange: function(bp_name, src) {
        assert.equal($el.find('img').attr('src'), src);
        done();
      },
    });
  }
);

QUnit.test('Callback onAfterChange is called once when provided.', function(
  assert
) {
  var done = assert.async(1);
  var $el = $(markupDefault);
  $el.smartImages({
    onAfterChange: function(bp_name, src) {
      assert.ok(bp_name);
      assert.ok(src);
      assert.ok(true);
      done();
    },
  });
});

QUnit.test('Callback onBeforeChange is called once when provided.', function(
  assert
) {
  var done = assert.async(1);
  var $el = $(markupDefault);
  $el.smartImages({
    onBeforeChange: function(bp_name, src) {
      assert.ok(bp_name);
      assert.ok(src);
      assert.ok(true);
      done();
    },
  });
});

QUnit.test('Callback onInit is called once when provided.', function(assert) {
  var done = assert.async(1);
  var $el = $(markupDefault);
  $el.smartImages({
    onInit: function() {
      assert.ok(true);
      done();
    },
  });
});

QUnit.test('All span elements are hidden on init.', function(assert) {
  var $el = $(markupDefault);
  $el.smartImages();
  assert.equal(
    $el
      .find('span')
      .eq(0)
      .attr('style'),
    'display: none;'
  );
  assert.equal(
    $el
      .find('span')
      .eq(1)
      .attr('style'),
    'display: none;'
  );
  assert.equal(
    $el
      .find('span')
      .eq(2)
      .attr('style'),
    'display: none;'
  );
  assert.equal(
    $el
      .find('span')
      .eq(3)
      .attr('style'),
    'display: none;'
  );
});

QUnit.test(
  'Assert data-media converts to breakpoints correctly for normal use.',
  function(assert) {
    var $el = $(markupDefault);
    $el.smartImages();
    var bpx = $el.data('breakpointX');
    assert.equal(bpx.segmentNames.length, 4);
    assert.equal(bpx.segmentNames[0], 'max-width:767px');
    assert.equal(bpx.segmentNames[1], '(min-width:768px) and (max-width:959px)');
    assert.equal(bpx.segmentNames[2], '(min-width:960px) and (max-width:1079px)');
    assert.equal(bpx.segmentNames[3], 'min-width:1080px');
  }
);

QUnit.test(
  'Assert data-media converts to breakpoints correctly when no mobile.',
  function(assert) {
    var $el = $(markupSpanOrderIsDirty);
    $el.smartImages({
      dataPrefix: '',
      dataSrcSuffix: 'no-retina-src',
      srcSelector: 'span',
    });
    var bpx = $el.data('breakpointX');
    assert.equal(bpx.segmentNames.length, 4);
    assert.equal(bpx.segmentNames[0], '0-767');
    assert.equal(bpx.segmentNames[1], '(min-width:768px) and (max-width:959px)');
    assert.equal(bpx.segmentNames[2], '(min-width:960px) and (max-width:1079px)');
    assert.equal(bpx.segmentNames[3], 'min-width:1080px');
  }
);

QUnit.test('Able to detect version.', function(assert) {
  assert.ok($.fn.smartImages.version, 'Version is not empty.');
});

/**
 * HTML markup to use in the tests.
 *
 * @type {string}
 */
var markupSpanOrderIsDirty =
  '<div>\n' +
  '    <span data-media="(min-width:960px) and (max-width:1079px)"></span>\n' +
  '    <span data-media="(min-width:768px) and (max-width:959px)"></span>\n' +
  '    <span data-media="min-width:1080px"></span><img/>\n' +
  '  </div>';

/**
 * HTML markup to use in the tests.
 *
 * @type {string}
 */
var markupDefault =
  '<div>\n' +
  '    <span data-si-srcset="small.jpg" data-si-media="max-width:767px"></span>\n' +
  '    <span data-si-srcset="medium.jpg" data-si-media="(min-width:768px) and (max-width:959px)"></span>\n' +
  '    <span data-si-srcset="large.jpg" data-si-media="(min-width:960px) and (max-width:1079px)"></span>\n' +
  '    <span data-si-srcset="jumbo.jpg" data-si-media="min-width:1080px"></span><img/>\n' +
  '  </div>';

/**
 * HTML markup to use in the tests for no mobile
 *
 * @type {string}
 */
var markupNoMobile = '<div class="smart-image">\n' +
  '    <span data-si-srcset="images/large.jpg" data-si-media="(min-width:480px) and (max-width: 767px)"></span>\n' +
  '    <span data-si-srcset="images/jumbo.jpg" data-si-media="(min-width:768px)"></span>\n' +
  '    <img/>\n' +
  '  </div>';
