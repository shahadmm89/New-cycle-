#!/usr/bin/env bash
# Render a print PDF to an RGB PNG through the FOGRA39 profile (soft proof).
# usage: render.sh in.pdf out.png dpi
gs -q -dNOPAUSE -dBATCH -sDEVICE=png16m -r"$3" -dUseTrimBox -dTextAlphaBits=4 -dGraphicsAlphaBits=4 \
   -sDefaultCMYKProfile=/usr/share/color/icc/colord/FOGRA39L_coated.icc -sOutputFile="$2" "$1"
