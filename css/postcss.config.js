import { execSync } from 'child_process';
import pkg from '../package.json' with { type: 'json' };
import postcssImport from 'postcss-import';
import postcssCustomSelectors from 'postcss-custom-selectors';
import postcssImportJson from '@daltontan/postcss-import-json';
import postcssDiscardComments from 'postcss-discard-comments';
import stylelint from 'stylelint';
import postcssSorting from 'postcss-sorting';
import postcssHeader from 'postcss-header';

const { version } = pkg;

// Get contributors from git
function getContributors() {
  try {
    const log = execSync("git log --format='%aN <%aE>' | sort -u")
      .toString()
      .split("\n")
      .filter(Boolean);

    // Process contributors: filter bots and specific names, extract names, deduplicate, and sort
    return [
      ...new Set(
        log
          .filter(contributor => {
            const name = contributor.toLowerCase();
            return !name.includes("dependabot") &&
                   !name.includes("[bot]") &&
                   !name.includes("bot@") &&
                   !name.includes("jaypanoz") &&
                   !name.includes("jiminy panoz");
          })
          .map(contributor => contributor.split("<")[0].trim())
      )
    ].sort();
  } catch (e) {
    console.warn("Could not get git contributors:", e.message);
    return [];
  }
}

const contributors = getContributors();
const contributorsSection = contributors.length > 0
  ? ` * Contributors: \n${contributors.map(name => ` * ${name}`).join("\n")}`
  : "";

const header = `/*!
 * Readium CSS v.${version}
 * Copyright (c) 2017–${new Date().getFullYear()}. Readium Foundation. All rights reserved.
 * Use of this source code is governed by a BSD-style license which is detailed in the
 * LICENSE file present in the project repository where this source code is maintained.
 * Core maintainer: Jiminy Panoz <jiminy.panoz@edrlab.org> 
${contributorsSection}
 */\n`;

export default (ctx) => ({
  map: false,
  plugins: [
    postcssImport({
      root: ctx.file.dirname
    }),
    postcssCustomSelectors({}),
    postcssImportJson({
      prefix: "--RS__"
    }),
    postcssDiscardComments({}),
    stylelint({
      "fix": true,
      "config": {
        "defaultSeverity": "warning",
        "rules": {
            "color-no-invalid-hex": true
          , "comment-no-empty": [ true, {
              "message": "Please remove empty comments."
          }]
          , "number-max-precision": 4
          , "unit-disallowed-list": [ ["pt"], {
              "message": "Sorry, this unit is not allowed. Please use another one."
            , "severity": "error"
          }]
          , "custom-property-pattern": [ "(RS|USER)__.+", {
              "message": "It looks like you're using a CSS variable prefix which is not supported. It should either start with '--RS__' or '--USER__'."
            , "severity": "error"
          }]
          , "color-hex-length": [ "long", {
              "message": "We recommend using long color HEX to prevent unexpected issues."
          }]
          , "font-family-name-quotes": [ "always-where-recommended", {
              "message": "If looks like there are spaces or digits in your 'font-family', please use quotes."
          }]
          , "function-url-quotes": "always"
          , "length-zero-no-unit": [ true, {
              "message": "The value of this property being 0, you don't need an unit. Please remove it."
          }]
          , "selector-type-case": "lower"
          , "function-name-case": "lower"
          , "value-keyword-case": "lower"
          , "selector-attribute-quotes": "always"
          , "comment-whitespace-inside": "always"
          , "at-rule-empty-line-before": "always"
          , "comment-empty-line-before": "always"
          , "rule-empty-line-before": "always"
          , "no-duplicate-at-import-rules": true
          , "no-invalid-double-slash-comments": [ true, {
              "message": "It looks like you're using single-line JS comments. This is CSS, you can't use that."
            , "severity": "error"
          }]
          , "max-nesting-depth": [ 0, {
              "message": "We're using Vanilla CSS with PostCSS and our current configuration doesn't allow nesting selectors as in LESS or SASS."
            , "severity": "error"
          }]
        }
      }
    }),
    postcssSorting({
      "properties-order": [
          "object-fit"
        , "position"
        , "top"
        , "right"
        , "bottom"
        , "left"
        , "z-index"
        , "display"
        , "float"
        , "columns"
        , "column-width"
        , "column-count"
        , "column-gap"
        , "column-fill"
        , "width"
        , "height"
        , "max-width"
        , "max-height"
        , "min-width"
        , "min-height"
        , "padding"
        , "padding-top"
        , "padding-right"
        , "padding-bottom"
        , "padding-left"
        , "margin"
        , "margin-top"
        , "margin-right"
        , "margin-bottom"
        , "margin-left"
        , "margin-collapse"
        , "margin-top-collapse"
        , "margin-right-collapse"
        , "margin-bottom-collapse"
        , "margin-left-collapse"
        , "overflow"
        , "overflow-x"
        , "overflow-y"
        , "clip"
        , "clear"
        , "font"
        , "font-family"
        , "font-size"
        , "font-smoothing"
        , "font-style"
        , "font-weight"
        , "hyphens"
        , "widows"
        , "orphans"
        , "src"
        , "line-height"
        , "letter-spacing"
        , "word-spacing"
        , "color"
        , "text-align"
        , "text-align-last"
        , "text-decoration"
        , "text-indent"
        , "text-overflow"
        , "text-rendering"
        , "text-size-adjust"
        , "text-shadow"
        , "text-transform"
        , "word-break"
        , "word-wrap"
        , "white-space"
        , "vertical-align"
        , "list-style"
        , "list-style-type"
        , "list-style-position"
        , "list-style-image"
        , "pointer-events"
        , "cursor"
        , "background"
        , "background-attachment"
        , "background-color"
        , "background-image"
        , "background-position"
        , "background-repeat"
        , "background-size"
        , "border"
        , "border-collapse"
        , "border-top"
        , "border-right"
        , "border-bottom"
        , "border-left"
        , "border-color"
        , "border-image"
        , "border-top-color"
        , "border-right-color"
        , "border-bottom-color"
        , "border-left-color"
        , "border-spacing"
        , "border-style"
        , "border-top-style"
        , "border-right-style"
        , "border-bottom-style"
        , "border-left-style"
        , "border-width"
        , "border-top-width"
        , "border-right-width"
        , "border-bottom-width"
        , "border-left-width"
        , "border-radius"
        , "border-top-right-radius"
        , "border-bottom-right-radius"
        , "border-bottom-left-radius"
        , "border-top-left-radius"
        , "border-radius-topright"
        , "border-radius-bottomright"
        , "border-radius-bottomleft"
        , "border-radius-topleft"
        , "content"
        , "quotes"
        , "outline"
        , "outline-offset"
        , "opacity"
        , "filter"
        , "visibility"
        , "size"
        , "zoom"
        , "transform"
        , "box-align"
        , "box-flex"
        , "box-orient"
        , "box-pack"
        , "box-shadow"
        , "box-sizing"
        , "table-layout"
        , "animation"
        , "animation-delay"
        , "animation-duration"
        , "animation-iteration-count"
        , "animation-name"
        , "animation-play-state"
        , "animation-timing-function"
        , "animation-fill-mode"
        , "transition"
        , "transition-delay"
        , "transition-duration"
        , "transition-property"
        , "transition-timing-function"
        , "background-clip"
        , "backface-visibility"
        , "resize"
        , "appearance"
        , "user-select"
        , "interpolation-mode"
        , "direction"
        , "marks"
        , "page"
        , "column-break-after"
        , "page-break-after"
        , "break-after"
        , "column-break-before"
        , "page-break-before"
        , "break-before"
        , "column-break-inside"
        , "page-break-inside"
        , "break-inside"
        , "unicode-bidi"
        , "speak"
      ],
      "unspecified-properties-position": "bottomAlphabetical"
    }),
    postcssHeader({
      header: header,
      headerLength: 0
    })
  ]
})
