# Using _resizer.sh_ to manipulate images

A script has been included that allows you to batch resize images in different breakpoints.

1. Create a directory.
2. Add one or more images to that directory.
3. Copy that path to that directory.
4. Call the script with your widths, which are 1px less than your breakpoints.
    
        ./resizer.sh <path to images> <width> <width2> ...
