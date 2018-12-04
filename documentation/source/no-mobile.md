# Use Case: No Image in Mobile

The first code block represents a normal use case for 2 breakpoints and three images:

    <div class="smart-image">
      <span data-si-srcset="small.jpg" data-si-media="max-width:480px"></span>
      <span data-si-srcset="medium.jpg" data-si-media="max-width:767px"></span>
      <span data-si-srcset="large.jpg" data-si-media="min-width:768px"></span>
      <img/>
    </div>

But if we didn't want an image to appear when screen is <= 480px, what to do?  Alter the markup as per the following:

    <div class="smart-image">
      <span data-si-srcset="medium.jpg" data-si-media="(min-width:481px) and (max-width:767px)"></span>
      <span data-si-srcset="large.jpg" data-si-media="min-width:768px"></span>
      <img/>
    </div>

Note that a CSS class is added to the image when `src` is empty, `si-has-not-src`.  (The `si-` prefix is configurable via the plugin settings.) You may want to use this class to do something with the `<img/>` tag.  For example to hide the broken image icon in some browsers you should at least do this:

    img.si-has-not-src {
      display: none;
    }
