#!/bin/sh
set -eu

ROOT="$(CDPATH= cd -- "$(dirname "$0")/.." && pwd)"
BRAND_DIR="$ROOT/assets/brand"
FONT_DISPLAY="$ROOT/assets/fonts/Tektur-Medium.ttf"
FONT_BODY="$ROOT/assets/fonts/InstrumentSans-Regular.ttf"

mkdir -p "$BRAND_DIR"

magick -background none "$BRAND_DIR/logo-mark.svg" -resize 1024x1024 "$BRAND_DIR/logo-mark.png"
magick "$BRAND_DIR/logo-mark.png" -resize 256x256 "$BRAND_DIR/favicon.png"
magick "$BRAND_DIR/logo-mark.png" -resize 180x180 "$BRAND_DIR/apple-touch-icon.png"

magick \
  -size 1500x420 xc:none \
  \( "$BRAND_DIR/logo-mark.png" -resize 260x260 \) -gravity west -geometry +24+0 -composite \
  -font "$FONT_DISPLAY" -pointsize 180 -fill "#F3ECE3" -gravity west -annotate +330-12 "ONYXAI" \
  -font "$FONT_BODY" -pointsize 40 -fill "#7FE1D5" -gravity west -annotate +338+126 "AI MEMORY ASSISTANT" \
  "$BRAND_DIR/logo-wordmark.png"

magick \
  -size 1600x900 xc:"#08090D" \
  \( -size 1600x900 radial-gradient:'#18212C-#08090D' -alpha set -channel A -evaluate multiply 0.75 +channel \) -compose screen -composite \
  \( -size 1200x1200 radial-gradient:'#7FE1D5-#000000' -alpha set -channel A -evaluate multiply 0.22 +channel \) -gravity northwest -geometry -280-260 -compose screen -composite \
  \( -size 1100x1100 radial-gradient:'#ED9A63-#000000' -alpha set -channel A -evaluate multiply 0.18 +channel \) -gravity southeast -geometry -120-120 -compose screen -composite \
  \( "$BRAND_DIR/logo-mark.png" -resize 390x390 \) -gravity east -geometry +150+0 -composite \
  -fill none -stroke 'rgba(255,255,255,0.12)' -strokewidth 2 -draw 'roundrectangle 70,70 1530,830 44,44' \
  -fill none -stroke 'rgba(127,225,213,0.22)' -strokewidth 2 -draw 'ellipse 1180,450 250,250 0,360' \
  -font "$FONT_DISPLAY" -pointsize 120 -fill "#F3ECE3" -gravity northwest -annotate +110+210 "ONYXAI" \
  -font "$FONT_BODY" -pointsize 44 -fill "#7FE1D5" -gravity northwest -annotate +116+332 "THE SECOND MEMORY FOR FAST-MOVING KNOWLEDGE WORK" \
  -font "$FONT_BODY" -pointsize 34 -fill "#B4B8C6" -gravity northwest -annotate +116+430 "Capture conversations. Distill the signal. Recall what matters." \
  -font "$FONT_BODY" -pointsize 34 -fill "#B4B8C6" -gravity northwest -annotate +116+480 "Turn meetings, notes, and ideas into action-ready memory." \
  -font "$FONT_BODY" -pointsize 30 -fill "#ED9A63" -gravity northwest -annotate +116+632 "onyxai.lol" \
  "$BRAND_DIR/social-card.png"
