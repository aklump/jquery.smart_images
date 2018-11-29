# Use Case: No Image in Mobile

The first code block represents a normal use case for 2 breakpoints and three images:

    <div class="smart-image">
      <span data-si-srcset="small.jpg" data-si-media="max-width: 480px"></span>
      <span data-si-srcset="medium.jpg" data-si-media="max-width: 767px"></span>
      <span data-si-srcset="large.jpg" data-si-media="min-width: 768px"></span>
      <img/>
    </div>

But if we didn't want an image to appear when screen is <= 480px, what to do?  Alter the markup as per the following:

    <div class="smart-image">
      <span data-si-srcset="medium.jpg" data-si-media="(min-width: 481px) and (max-width: 767px)"></span>
      <span data-si-srcset="large.jpg" data-si-media="min-width: 768px"></span>
      <img/>
    </div>
