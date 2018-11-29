# Smart Images

![Smart Images](images/smart-images.jpg)

## Summary

Window width based image loading for responsive applications.

**Visit <https://aklump.github.io/smart_images> for full documentation.**

## Quick Start

1.  Install with `yarn add @aklump/smart-images` or `npm i @aklump/smart-images`
1.  Please open `demo/index.html` to see this plugin in action.

## Requirements

* jQuery >= 1.4

## Contributing

If you find this project useful... please consider [making a donation](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=4E5KZHDQCEUV8&item_name=Gratitude%20for%20aklump%2Fsmart_images).

## Installation

1. lorem
1. ipsum

## Usage

Here is an example, the simplest use case, a single breakpoint between mobile and desktop at 768px.  Your usage will vary depending upon the number of breakpoints you choose.

1. Create a mobile image at 767px wide.
2. Create a desktop image larger than 767px and wide enough for desktop, e.g. 1080px.
3. Define the HTML markup:

        <div class="smart-image">
          <span data-si-srcset="mobile.jpg" data-si-media="max-width: 767px"></span>
          <span data-si-srcset="desktop.jpg" data-si-media="min-width: 768px"></span>
          <img/>
        </div>

4. Add the Javascript.

        $('document').ready(function () {
          $('.smart-image').smartImages();
        });
        
5. Set your browser width to less than 768 pixels and load your page.
6. Notice the mobile image has been set in the img tag's `src` attribute.
7. Resize to greater than 768 pixels and notice the img tag `src` changes to _desktop.jpg_.

