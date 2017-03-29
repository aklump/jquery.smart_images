#!/usr/bin/env bash

images="$1"
breakpoints=("${@:2}")

if [[ ! "$images" ]] || [[ ! "$breakpoints" ]]; then
  echo "`tput setaf 3`Usage ./resizer.sh [path/to/image_dir] 300 460 748 950 etc...`tput op`"
  exit
fi

# Setup our directories
for breakpoint in ${breakpoints[@]}; do
  if [[ ! -d "$images/$breakpoint" ]]; then
    mkdir "$images/$breakpoint"
  fi
done

# Create our derivatives
for i in $(find $images -name *.jpg -maxdepth 1); do
  basename=${i##*/}
  for breakpoint in ${breakpoints[@]}; do
    
    # Make a copy
    cp -R "$i" "$images/$breakpoint/$basename"

    NAME=`echo "$basename" | cut -d'.' -f1`
    EXTENSION=`echo "$basename" | cut -d'.' -f2`
    retina="${NAME}@2x.${EXTENSION}"
    cp -R "$i" "$images/$breakpoint/$retina"

    # Downsize the copy
    sips -Z $breakpoint "$images/$breakpoint/$basename"
    echo "`tput setaf 2`$breakpoint/$i created at $breakpoint px wide`tput op`"

    # @2x derivative
    double=$[breakpoint * 2]
    echo $double
    sips -Z $double "$images/$breakpoint/$retina"
    echo "`tput setaf 2`$breakpoint/$i created at $double px wide`tput op`"
  done
done
