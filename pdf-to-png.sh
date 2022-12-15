#!/bin/bash

SIZE=8192

if [ $# == 0 ]
then
   echo "Usage $0 <files>"
   exit 1
fi

for pdf in "${@}"
do
    inkscape --without-gui "${pdf}" \
             --export-background=#ffffffff \
             --export-width="${SIZE}" --export-height="${SIZE}" \
             --export-png="${pdf%.pdf}.png"
done
