/**
 * __title jQuery JavaScript Plugin v__version
 *
 * __description
 *
 * Copyright 2017__year, __author
 * @license Dual licensed under the MIT or GPL Version 3 licenses.
 * __url
 *
 * Date: __date
 */
/**
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
})(function($, BreakpointX) {
  function SmartImages(el, options) {
    this.settings = $.extend({}, $.fn.smartImages.defaults, options);
    this.$el = $(el);
    this.$img = this.$el.find(this.settings.imgSelector);
    this.init();
  }

  /**
   * Initialize an instance.
   */
  SmartImages.prototype.init = function() {
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

    /**
     * An indexed array of integers holding the single breakpoint values.
     * @type {Array}
     */
    var breakpointIndex = [];

    var $el = this.$el,
      s = this.settings,
      srcSelector =
        s.srcSelector || '[data-' + s.dataPrefix + s.dataMediaSuffix + ']',
      $imageSpans = $el.find(srcSelector);

    if ($imageSpans.length === 0) {
      throw new Error('No elements found matching: ' + srcSelector);
    }

    var self = this,
      p = this.settings.dataPrefix;

    // Acquire the data value from all span elements.
    $imageSpans

      // These serve as data only, and should not display.
      .hide()

      // It's imperative that we sort the elements first in case the DOM is
      // dirty.
      .sort(sortElementsByMediaQuery)

      // Now we'll go through and setup our indexes based on queries.
      .each(function() {
        var mediaQuery = getMediaQueryFromEl(this);
        addBreakpointsToIndexByMediaQuery(mediaQuery);
        var src = $(this).attr('data-' + p + s.dataSrcSuffix);

        self.srcMap[mediaQuery.replace(/: /g, ':')] = src;
      });

    // Now create the breakpoint object, which can be globally accessed by
    // using the selector $el.data('breakpointX')
    this.breakpointX = new BreakpointX(breakpointIndex, {
      resizeThrottle: s.resizeThrottle,
    });
    this.$el.data('breakpointX', this.breakpointX);

    this.breakpointX
      .add('bigger', this.breakpointX.aliases, function(from, to) {
        var abort =
          s.downsize === 'never' &&
          (self.largestLoaded === true ||
            (to.maxWidth && self.largestLoaded > to.maxWidth));
        if (!abort) {
          self.changeHandler(to);
        }
      })
      .add('smaller', this.breakpointX.aliases, function(from, to) {
        if (
          s.downsize === 'always' ||
          (s.downsize === 'loaded' && self.loaded[to.name])
        ) {
          self.changeHandler(to);
        }
      });

    if (this.settings.onInit) {
      this.settings.onInit.call(this);
    }

    var width = this.breakpointX.value(this.breakpointX.current);
    this.changeHandler({
      name: this.breakpointX.current,
      minWidth: width[0],
      maxWidth: width[1],
    });

    /**
     * Return an image elements's media query from it's data attribute.
     *
     * This is not the <img/> tag, but (probably) the <span> tag.
     *s
     * @param el
     *   An element or jQuery object representing an image for a given
     *   breakpoint.
     * @returns {string}
     */
    function getMediaQueryFromEl(el) {
      // We cannot use .data here, because the attr may have been altered
      // AFTER data was read in.  So we must use .attr instead
      // 2017-03-29T21:19, aklump.
      return $(el).attr('data-' + s.dataPrefix + s.dataMediaSuffix) || '';
    }

    /**
     * Get the min and max valus from a media query string.
     *
     * @param mediaQuery
     *
     * @returns {[]}
     *   - 0 int The minumum value or null.
     *   - 1 int The maximum value or Infinity.
     */
    function parseMediaQuery(mediaQuery) {
      var min = mediaQuery.match(/min\-width:\s*(\d+)\s*px/),
        max = mediaQuery.match(/max\-width:\s*(\d+)\s*px/);

      return [min ? min[1] * 1 : null, max ? max[1] * 1 : null];
    }

    /**
     * Parse a media query and update our different indexes.
     * @param breakpointIndex
     * @param mediaQuery
     *
     * @see breakpointIndex
     */
    function addBreakpointsToIndexByMediaQuery(mediaQuery) {
      var range = parseMediaQuery(mediaQuery),
        min = range[0] || 0,
        max = range[1];
      if (breakpointIndex.length === 0) {
        breakpointIndex.push(min);
      }
      if (max) {
        breakpointIndex.push(max + 1);
      }
    }

    /**
     * Sorting callback for sorting by media query.
     *
     * This will put items in the low to high based on media query.
     *
     * @param a
     * @param b
     * @returns {number}
     */
    function sortElementsByMediaQuery(a, b) {
      var aq = parseMediaQuery(getMediaQueryFromEl(a));
      aq = aq[1] ? aq[1] : aq[0];
      aq *= 1;
      var bq = parseMediaQuery(getMediaQueryFromEl(b));
      bq = bq[1] ? bq[1] : bq[0];
      bq *= 1;

      return aq - bq;
    }
  };

  /**
   * Return all possible media queries for a min/max range.
   *
   * @param int min The lower breakpoint
   * @param int max One pixel less than the upper breakpoint.
   * @returns {string[]}
   */
  function getMediaQueryPermutations(breakpointDefinition) {
    var permutations = [];
    if (breakpointDefinition.maxWidth) {
      permutations.push(
        'max-width:' + (breakpointDefinition.minWidth - 1) + 'px'
      );
      permutations.push(
        '(min-width:' +
          (breakpointDefinition.minWidth + 1) +
          'px) and (max-width:' +
          breakpointDefinition.maxWidth +
          'px)'
      );
    } else {
      permutations.push('min-width:' + breakpointDefinition.minWidth + 'px');
    }
    return permutations;
  }

  /**
   * Respond to entering into a breakpoint.
   *
   * @param object to
   *   The breakpoint range definition that was moved (in)to.
   */
  SmartImages.prototype.changeHandler = function(to) {
    if (!to) {
      var range = this.breakpointX.value(this.breakpointX.current);
      to = {
        minWidth: range[0],
        masWidth: range[1],
      };
    }
    var names = getMediaQueryPermutations(to),
      name = null;
    for (var i in names) {
      if (this.srcMap[names[i]]) {
        name = names[i];
        break;
      }
    }

    var src = this.srcMap[name] || '',
      abort =
        this.settings.onBeforeChange &&
        this.settings.onBeforeChange.call(this, name, src) === false;
    if (abort) {
      return;
    }
    this.largestLoaded = to.maxWidth || true;
    this.loaded[name] = true;
    this.$img.attr('src', src);
    var cssClass = this.settings.dataPrefix + 'has-not-src';
    src ? this.$img.removeClass(cssClass) : this.$img.addClass(cssClass);
    if (this.settings.onAfterChange) {
      this.settings.onAfterChange.call(this, name, src);
    }
  };

  /**
   * Remove data from $el, which were added by this plugin.
   */
  SmartImages.prototype.destroy = function() {
    this.$el.removeData('smartImages');
    this.$el.removeData('breakpointX');
  };

  $.fn.smartImages = function(options, methodArgs) {
    return this.each(function() {
      var obj = $.data(this, 'smartImages');
      // When method is passed as a string option, call it.
      if (
        obj &&
        typeof options === 'string' &&
        typeof obj[options] === 'function'
      ) {
        obj[options](methodArgs);
      } else {
        $.data(this, 'smartImages', new SmartImages(this, options));
      }
    });
  };

  $.fn.smartImages.defaults = {
    /**
     * Namespace for all data tags and css classes, e.g. 'si-'.
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
    onAfterChange: null,
  };

  /**
   * Returns the smartImages version.
   *
   * @return {string}
   */
  $.fn.smartImages.version = function() {
    return '__version';
  };
});
