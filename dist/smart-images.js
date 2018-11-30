/**
 * @aklump/smart-images jQuery JavaScript Plugin v0.2.2
 * http://www.intheloftstudios.com/packages/js/jquery.smart_images
 *
 * Window width-based image loading for responsive applications.
 *
 * Copyright 2017-2018, Aaron Klump <sourcecode@intheloftstudios.com>
 * @license Dual licensed under the MIT or GPL Version 3 licenses.
 *
 * Date: Fri Nov 30 08:03:52 PST 2018
 */
/**
 * @link
  * Instantiate this plugin thus:
 * @code
 *   $('.smart-image').smartImages({
 *     "cssPrefix"         : 'smart-images-'
 *   });
 * @endcode
 *
 * To get the SmartImages object after it's attached you can do this:
 * @code
 *   var smartImages = $('.smart-image').data('smartImages');
 * @endcode
 *
 * To call an object method, two forms are possible.  When you must pass
 * arguments to the method, you should use the later form, obtaining an object
 * first and then explicitely calling the method on it.
 *   @code
 *     $('.smart-image').smartImages('{method}');
 *   @endcode
 *
 *   or when arguments must be passed, or you already have the object:
 *
 *   @code
 *     var obj = $('.smart-image').data('smartImages');
 *     obj.{method}(arg1, arg2, argN...);
 *   @endcode
 *
 * To destroy the effects of this you may call the destroy method.
 */
(function(factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['jquery', '@aklump/breakpointx'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // Node/CommonJS
    module.exports = function(root, jQuery) {
      if (jQuery === undefined) {
        // require('jQuery') returns a factory that requires window to
        // build a jQuery instance, we normalize how we use modules
        // that require this pattern but the window provided is a noop
        // if it's defined (how jquery works)
        if (typeof window !== 'undefined') {
          jQuery = require('jquery');
        } else {
          jQuery = require('jquery')(root);
        }
      }
      factory(jQuery, require('@aklump/breakpointx'));
      return jQuery;
    };
  } else {
    // Browser globals
    factory(jQuery, BreakpointX);
  }
}(function($, BreakpointX) {
  function SmartImages(el, options) {
    this.settings = $.extend({}, $.fn.smartImages.defaults, options);
    this.$el = $(el);
    this.$img = this.$el.find(this.settings.imgSelector);
    this.init();
  }

  /**
   * Initialize an instance.
   */
  SmartImages.init = function() {
    /**
     * Maps the aliases to the image srcs
     * @type {{}}
     */
    this.srcMap = {};

    /**
     * Stores which breakpoint aliases have been loaded.
     * @type {{}}
     */
    this.loaded = {};

    /**
     * Holds the integer value of the largest pixels loaded or true, if the
     * largest.
     * @type {null}
     */
    this.largestLoaded = null;

    var $el = this.$el,
      self = this,
      s = self.settings,
      p = s.dataPrefix,
      max = [],
      min = [],
      breakpoints = [0],
      srcSelector = s.srcSelector || '[data-' + s.dataPrefix + s.dataMediaSuffix + ']';

    // Acquire the data value from all span elements
    $el.find(srcSelector)
      .hide()
      .each(function() {
        // We cannot use .data here, because the attr may have been altered
        // AFTER data was read in.  So we must use .attr instead
        // 2017-03-29T21:19, aklump.
        var data = $(this).attr('data-' + p + s.dataMediaSuffix),
          src = $(this).attr('data-' + p + s.dataSrcSuffix),
          declarations = data.match(/((min|max)\-width:\s*(\d+)\s*px)/g);

        for (var i in declarations) {
          var declaration = declarations[i],
            parts = declaration.match(/(.+)-width:\s*(\d+)\s*px/);
          self.srcMap[data.replace(/: /g, ':')] = src;

          if (parts.length !== 3) {
            throw 'Bad value: \'' + data + '\' in media.';
          }

          var pixels = parts[2] * 1,
            isCompoundMediaQuery = declarations.length > 1;
          if (isCompoundMediaQuery) {
            pixels += (parts[1] === 'min' ? -1 : 1);
          } else {
            pixels++;
          }
          if (isCompoundMediaQuery || parts[1] === 'max') {
            max.push([src, pixels]);
            breakpoints.push(pixels);
          } else if (parts[1] === 'min') {
            min.push([src, pixels]);
          }
        }
      });

    var sort = function(a, b) {
      a[1] *= 1;
      b[1] *= 1;
      if (a[1] === b[1]) {
        return 1;
      }
      return a[1] < b[1] ? -1 : 1;
    };

    // Assert we only have one min
    if (min.length !== 1) {
      throw 'You MUST declare only 1 min-width.';
    }
    max.sort(sort);

    // Assert that the min is 1 pixel greater than the last min.
    if (min[0][1] - 1 !== max[max.length - 1][1]) {
      throw 'The min-width MUST be 1px > than highest max-width.';
    }

    // Now create the breakpoint object
    this.bp = new BreakpointX(breakpoints, {
      resizeThrottle: s.resizeThrottle
    });
    this.bp
      .add('bigger', this.bp.aliases, function(from, to) {
        var abort = (s.downsize === 'never' && (self.largestLoaded === true || (to.maxWidth && self.largestLoaded > to.maxWidth)));
        if (!abort) {
          self.changeHandler(to);
        }
      })
      .add('smaller', this.bp.aliases, function(from, to) {
        if (s.downsize === 'always' || s.downsize === 'loaded' && self.loaded[to.name]) {
          self.changeHandler(to);
        }
      });

    if (this.settings.onInit) {
      this.settings.onInit.call(this);
    }

    this.firstRun = true;
    var width = this.bp.value(this.bp.current);
    this.changeHandler({
      name: this.bp.current,
      minWidth: width[0],
      maxWidth: width[1]
    });
    this.firstRun = false;
  };

  /**
   * Return all possible media queries for a min/max range.
   *
   * @param int min The lower breakpoint
   * @param int max One pixel less than the upper breakpoint.
   * @returns {string[]}
   */
  function getMediaQueryPermutations(min, max) {
    var permutations = [];
    if (max) {
      permutations.push('max-width:' + (min - 1) + 'px');
      permutations.push('(min-width:' + (min + 1) + 'px) and (max-width:' + max + 'px)');
    } else {
      permutations.push('min-width:' + min + 'px');
    }
    return permutations;
  }

  /**
   * Respond to entering into a breakpoint.
   *
   * @param breakpointAlias
   */
  SmartImages.changeHandler = function(data) {
    var names = getMediaQueryPermutations(data.minWidth, data.maxWidth),
      name = null;
    for (var i in names) {
      if (this.srcMap[names[i]]) {
        name = names[i];
        break;
      }
    }

    var src = this.srcMap[name] || '',
      abort = this.settings.onBeforeChange && this.settings.onBeforeChange.call(this, name, src) === false;
    if (abort) {
      return;
    }
    this.largestLoaded = data.maxWidth || true;
    this.loaded[name] = true;
    this.$img.attr('src', src);
    if (this.settings.onAfterChange) {
      this.settings.onAfterChange.call(this, name, src);
    }
  };

  SmartImages.destroy = function() {
    $(this.$el).removeData('smartImages');
  };

  $.fn.smartImages = function(options, methodArgs) {
    return this.each(function() {
      var obj = $.data(this, 'smartImages');
      // When method is passed as a string option, call it.
      if (obj && typeof options === 'string' && typeof obj[options] === 'function') {
        obj[options](methodArgs);
      } else {
        $.data(this, 'smartImages', new SmartImages(this, options));
      }
    });
  };

  $.fn.smartImages.defaults = {

    /**
     * Namespace for all data tags, e.g. 'si-'.
     */
    dataPrefix: 'si-',
    dataSrcSuffix: 'srcset',
    dataMediaSuffix: 'media',

    /**
     * Used with $el.find() to locate the img tag that gets replaced with src.
     */
    imgSelector: 'img',

    /**
     * Used with $el.find() to locate the tags that contain the srcsets. By
     * default this is null because it uses the data suffixes above, but
     * setting it here will override that behavior.  This would allow you to
     * use an alternate structure if necessary.
     */
    srcSelector: null,

    /**
     * How many milliseconds to wait to read the window width after a resize
     * event.
     */
    resizeThrottle: 300,

    /**
     * This setting answers the question of loading smaller images when the
     * window downsizes.
     *
     * 'never' means the largest image that gets loaded first will always show.
     *  Use this method to reduce bandwidth, and if aspect ratios are the same
     * across breakpoints.  THIS IS THE FASTEST AND USES THE LEAST BANDWIDTH.
     *
     * Setting this to 'always' will mean that the images are swapped BOTH when
     * the window grows larger and grows smaller and results in more data
     * transfer when the window starts out larger because the smaller images
     * need to be downloaded.  One reason to choose this setting is if the
     * aspect ratios are different for different breakpoints--to ensure images
     * don't distort.  USE THIS OPTION IF ASPECT RATIOS ARE DIFFERENT ACROSS
     * BREAKPOINTS.
     *
     * 'loaded' means smaller images will be shown if they were previously
     * loaded.  This happens when the window starts out small, grows larger,
     * then shrinks back.  This option may give better visual appearance
     * because the browser is not resizing the image.  Compared to 'never' this
     * results in a slight delay as the window grows larger, and the image
     * needs to be swapped out for the larger. USE THIS OPTION IF YOU NOTICE
     * SMALLER IMAGES ARE NOT AS CLEAR AS YOU WANT.
     *
     * One of:
     * - never
     * - always
     * - loaded
     */
    downsize: 'never',

    /**
     * Callback fired on initializing before loading the first images.
     */
    onInit: null,

    /**
     * Callback before a src change is to occur.  Only the first time this is
     * called will `this.firstRun` be true.
     *
     * Return false to prevent the image src swap.
     *
     * @param string breakpoint name
     * @param string image src
     */
    onBeforeChange: null,

    /**
     * Callback just after a src change has occurred.
     *
     * @param string breakpoint name
     * @param string image src
     */
    onAfterChange: null
  };

  /**
   * Returns the smartImages version.
   *
   * @return {string}
   */
  $.fn.smartImages.version = function() {
    return '0.2.2';
  };
}));
