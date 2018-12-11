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
     * Maps the media queries to the image src
     * @type {{}}
     */
    this.srcMap = {};

    /**
     * Stores the image widths that have been loaded.
     * @type {{}}
     */
    this.loaded = [];

    /**
     * Holds the width of the image active in the src tag.
     * @type {null}
     */
    this.srcWidth = null;

    var self = this,
      $el = this.$el,
      s = this.settings,
      srcSelector =
        s.srcSelector || '[data-' + s.dataPrefix + s.dataMediaSuffix + ']',
      $imageSpans = $el.find(srcSelector);

    if ($imageSpans.length === 0) {
      throw new Error('No elements found matching: ' + srcSelector);
    }

    var p = this.settings.dataPrefix;

    this.breakpointX = new BreakpointX({
      resizeThrottle: s.resizeThrottle,
    });
    this.$el.data('breakpointX', this.breakpointX);

    self.srcMap = {};
    $imageSpans

      // These serve as data only, and should not display.
      .hide()

      // Now we'll go through and setup our indexes based on queries.
      .each(function() {
        // We cannot use .data here, because the attr may have been altered
        // AFTER data was read in.  So we must use .attr instead
        // 2017-03-29T21:19, aklump.
        var mediaQuery =
          $(this).attr('data-' + s.dataPrefix + s.dataMediaSuffix) || '';
        self.breakpointX.addSegmentByMedia(mediaQuery);
        var src = $(this).attr('data-' + p + s.dataSrcSuffix);
        self.srcMap[mediaQuery] = src;
      });

    this.breakpointX.addCrossAction(function(segment, direction) {
      var largestWidthLoaded = self.loaded.length
          ? Math.max.apply(Math, self.loaded)
          : null,
        widthNeeded = segment.imageWidth,
        apply = largestWidthLoaded === null;
      if (
        direction === 'bigger' &&
        (widthNeeded > largestWidthLoaded || widthNeeded > self.srcWidth)
      ) {
        apply = true;
      } else if (direction === 'smaller') {
        apply = true;
        switch (s.downsize) {
          case 'never':
            apply = false;
            break;
          case 'loaded':
            apply = self.loaded.indexOf(segment.imageWidth) >= 0;
            break;
        }
      }
      apply && self.changeHandler(segment);
    });

    if (this.settings.onInit) {
      var segment = this.breakpointX.getSegment(s.initialWidth);
      this.settings.onInit.call(this, segment);
    }
    this.breakpointX.triggerActions(s.initialWidth);
  };

  /**
   * Respond to entering into a segment.
   *
   * @param object to
   *   The breakpoint segment that was entered.
   */
  SmartImages.prototype.changeHandler = function(segment) {
    segment = segment || this.breakpointX.getSegmentByWindow();
    var self = this,
      src = self.srcMap[segment.name] || '',
      userCancelled =
        self.settings.onBeforeChange &&
        self.settings.onBeforeChange.call(self, segment, src) === false;
    if (userCancelled) {
      return;
    }
    var noImageClass = self.settings.dataPrefix + 'has-not-src';
    self.$img.attr('src', src);
    self.srcWidth = src ? segment.imageWidth : null;
    if (src) {
      self.loaded.push(segment.imageWidth);
    }
    src ? self.$el.removeClass(noImageClass) : self.$el.addClass(noImageClass);
    if (self.settings.onAfterChange) {
      self.settings.onAfterChange.call(self, segment, src);
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
    resizeThrottle: 200,

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
     *
     * @param object segment
     *   This the segment representing the initial width.
     */
    onInit: null,

    /**
     * Callback before a src change is to occur.  Only the first time this is
     * called will `this.firstRun` be true.
     *
     * Return false to prevent the image src swap.
     *
     * @param object segment
     * @param string image src
     */
    onBeforeChange: null,

    /**
     * Callback just after a src change has occurred.
     *
     * @param object segment
     * @param string image src
     */
    onAfterChange: null,

    /**
     * A preset value to use instead the window width for onload handlers.
     *
     * @var int|null
     */
    initialWidth: null,
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
