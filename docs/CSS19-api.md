# Readium CSS Variables API

[Implementers’ doc]

This document is meant to list all the customizable medias and flags (to be found in `ReadiumCSS-config.css`), as well as all the CSS variables for Reading System and User styles available in the `dist` stylesheets.

As a reminder, the priority is, in general: 

```
USER > AUTHOR > RS
```

## How to set and remove user preferences

### Setting a user preference

```
var root = document.documentElement; 

root.style.setProperty("--USER__var", "value");
```

You don’t need to remove the variable before setting another value, the new value will simply override the existing one.

### Removing a user preference

```
var root = document.documentElement; 

root.style.removeProperty("--USER__var");
```

## Customizable flags

You will find those customizable flags in `ReadiumCSS-config.css`, and can think of the preset values as boolean inline styles: if they are set on the `:root` element (i.e. `html`) then the flag is enabled. If another value is, or they are removed, then the flag is disabled.

Those custom selectors can only be customized before runtime. You could for example use a class or a custom attribute instead of an inline style. Check the [“User Preferences”](../docs/CSS12-user_prefs.md#flags) and [“Quickstart”](../docs/CSS02-quickstart.md) docs for further details.

**Note:** The preset is not a default implementers should use. Indeed, the initialization of those flags depends on your user settings’ management e.g. apply user settings to all EPUBs, only the ones that have already been customized, etc.

* * * 

```
:--paged-view
```

Preset: `--USER__view: readium-paged-on`

Scope: `html`

Override class: Chrome (should be applied by any means necessary)

* * * 

```
:--scroll-view
```

Preset: `--USER__view: readium-scroll-on`

Scope: `html`

Override class: Chrome (should be applied by any means necessary)

* * *

```
:--deprecated-font-size
```

Preset: `--USER__fontSizeImplementation: readium-deprecatedFontSize-on`

Scope: `html`

Override class: None. This flag can be used to force the previous and deprecated implementation of font-size setting. It is also used automatically if the browser/rendering engine does not support CSS property `zoom` – note font-size normalization is not triggered by default in that case.

* * * 

```
:--fs-normalize
```

Preset: `--USER__fontSizeNormalize: readium-normalize-on`

Scope: `html`

Override class: None. This flag can be used to force font-size normalization if the browser/rendering engine does not support CSS property `zoom` and the book’s styles are using absolute units, breaking the font-size user submodule.

* * *

```
:--ios-patch
```

Preset: `--USER__iOSPatch: readium-iOSPatch-on`

Scope: `html`

Override class: None. This flag is used to activate patching of iOS scaling issues in Safari, which can happen on rotate for instance.

* * *

```
:--ipadOS-patch
```

Preset: `--USER__iPadOSPatch: readium-iPadOSPatch-on`

Scope: `html`

Override class: None. This flag is used to activate patching of iPadOS’ desktop-class experience in Safari, which disables zoom.

* * * 

```
:--blend-filter
```

Preset: `--USER__blendImages: readium-blend-on`

Scope: `html`

Override class: Chrome advanced (optional but should be applied by any means necessary if provided to users)

It impacts `img` and blends them using `mix-blend-mode`.


* * * 

```
:--darken-filter
```

Preset: `--USER__darkenImages: readium-darken-on`

Scope: `html`

Override class: Chrome advanced (optional but should be applied by any means necessary if provided to users)

It impacts `img` and darken them using a filter (`brightness(80%)`).

* * * 

```
:--invert-filter
```

Preset: `--USER__invertImages: readium-invert-on`

Scope: `html`

Override class: Chrome advanced (optional but should be applied by any means necessary if provided to users)

It impacts `img` and invert them using a filter (`invert(100%)`).

**Note: this will automatically invert gaiji since they are images.**

* * * 

```
:--invert-gaiji
```

Preset: `--USER__invertGaiji: readium-invertGaiji-on`

Scope: `html`

Override class: Chrome advanced (optional but should be applied by any means necessary if provided to users)

It impacts gaiji (valid Japanese character as `img`) and invert them using a filter (`invert(100%)`).

* * *

```
:--no-vertical-pagination
```

Preset: `--RS__disablePagination: readium-noVerticalPagination-on`

Scope: `html`

Override class: None. It’s a flag meant for implementers’ convenience as it disables vertical-writing pagination so that they can implement theirs.

* * *

```
:--no-overflow
```

Preset: `--RS__disableOverflow: readium-noOverflow-on`

Scope: `html`

Override class: None. It’s a flag meant for implementers’ convenience as it disables overflow so that they can implement theirs.

* * * 

```
:--a11y-normalize
```

Preset: `--USER__a11yNormalize: readium-a11y-on`

Scope: `html`

Override class: User settings advanced (optional but should be applied by any means necessary if provided to users)

It impacts font style, weight and variant, text decoration, super and subscripts.

* * *

```
:--no-ruby
```

Preset: `--USER__noRuby: readium-noRuby-on`

Scope: `html`

Override class: User settings advanced (optional but should be applied by any means necessary if provided to users)

This will hide ruby annotations i.e. `rt` and `rb`.

* * *

**Warning:** if you customize those flags, all ReadiumCSS `dist` stylesheets must be rebuilt.

## Reading System Styles

Custom properties for the Reading System are prefixed with `--RS__`.

### Pagination

Note these variables are publicly exposed as JSON in `css/vars` so that it’s easier to retrieve their value and use it in your codebase.

* * *

```
--RS__colWidth
```

The optimal column’s width. We set it to `100vw` (`100vh` in vertical-writing) for a single-column for Safari – otherwise it won’t fragment content, and `auto` for multiple so that the column-count can be prioritized.

* * *

```
--RS__colCount
```

The optimal number of columns (depending on the columns’ width).

* * *

```
--RS__colGap
```

The gap between columns. 

You must account for this gap when scrolling.

* * *

```    
--RS__pageGutter
```

The inline (horizontal by default, vertical in vertical-writing) page margins.

* * *

```
--RS__defaultLineLength
```

The default line-length when none is set by the user. It must be set in `rem` in order to take `:root`’s `font-size` as a reference, whichever the `body`’s `font-size` might be.

### Scroll

* * *

```
--RS__scrollPaddingTop
```

The `padding-top` for the `body`.

* * *

```
--RS__scrollPaddingBottom
```

The `padding-bottom` for the `body`.

* * *

```
--RS__scrollPaddingLeft
```

The `padding-left` for the `body`.

* * *

```
--RS__scrollPaddingRight
```

The `padding-right` for the `body`.

### Safeguards

* * *

```
--RS__maxMediaWidth
```

The `max-width` for media elements i.e. `img`, `svg`, `audio` and `video`.

* * *

```
--RS__maxMediaHeight
```

The `max-height` for media elements i.e. `img`, `svg`, `audio` and `video`.

* * *

```
--RS__boxSizingMedia
```

The box model (`box-sizing`) you want to use for media elements.

* * *

```
--RS__boxSizingTable
```

The box model (`box-sizing`) you want to use for tables.

### Default font-stacks

Note these variables are publicly exposed as JSON in `css/vars` so that it’s easier to retrieve their value and use it in your codebase.

* * *

```
--RS__oldStyleTf
```

An old style serif font-stack relying on pre-installed fonts.

Default is `"Iowan Old Style", Sitka, "Sitka Text", Palatino, "Book Antiqua", "URW Palladio L", P052, serif`.

* * *

```
--RS__modernTf
```

A modern serif font-stack relying on pre-installed fonts.

Default is `Athelas, Constantia, Charter, "Bitstream Charter", Cambria, "Georgia Pro", Georgia, serif`.

* * *

```
--RS__sansTf
```

A neutral sans-serif font-stack relying on pre-installed fonts.

Default is `-ui-sans-serif, -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI Variable", "Segoe UI", Inter, Roboto, "Helvetica Neue", "Arial Nova", "Liberation Sans", Arial, sans-serif`.

* * *

```
--RS__humanistTf 
```

A humanist sans-serif font-stack relying on pre-installed fonts.

Default is `Seravek, Calibri, "Gill Sans Nova", Roboto, Ubuntu, "DejaVu Sans", source-sans-pro, sans-serif`.

* * *

```
--RS__monospaceTf 
```

A monospace font-stack relying on pre-installed fonts.

Default is `ui-monospace, "Andale Mono", "Cascadia Code", "Source Code Pro", Menlo, Consolas, "DejaVu Sans Mono", monospace`.

### Default font-stacks for Japanese publications

* * *

```
--RS__serif-ja
```

A Mincho font-stack whose fonts with proportional latin characters are prioritized for horizontal writing.

Default is `"Hiragino Mincho ProN", "Hiragino Mincho Pro", "YuMincho", "BIZ UDPMincho", "Yu Mincho", "ＭＳ Ｐ明朝", "MS PMincho", serif`.

* * *

```
--RS__sans-serif-ja
```

A Gothic font-stack whose fonts with proportional latin characters are prioritized for horizontal writing.

Default is `"Hiragino Sans", "Hiragino Kaku Gothic ProN", "Hiragino Kaku Gothic Pro", "ヒラギノ角ゴ W3", "YuGothic", "Yu Gothic Medium", "BIZ UDPGothic", "Yu Gothic", "ＭＳ Ｐゴシック", "MS PGothic", sans-serif`.

* * *

```
--RS__serif-ja-v
```

A Mincho font-stack whose fonts with fixed-width latin characters are prioritized for vertical writing.

Default is `"Hiragino Mincho ProN", "Hiragino Mincho Pro", "YuMincho", "BIZ UDMincho", "Yu Mincho", "ＭＳ明朝", "MS Mincho", serif`.

* * *

```
--RS__sans-serif-ja-v
```

A Gothic font-stack whose fonts with fixed-width latin characters are prioritized for vertical writing.

Default is `"Hiragino Sans", "Hiragino Kaku Gothic ProN", "Hiragino Kaku Gothic Pro", "ヒラギノ角ゴ W3", "YuGothic", "Yu Gothic Medium", "BIZ UDGothic", "Yu Gothic", "ＭＳゴシック", "MS Gothic", sans-serif`.

### Base styles for all ebooks

* * *

```
--RS__baseFontFamily
```

The default typeface for body copy in case the ebook doesn’t have one declared.

Please note some languages have a specific font-stack (japanese, chinese, hindi, etc.)

* * *

```
--RS__baseLineHeight
```

The default line-height for body copy in case the ebook doesn’t have one declared.

### Default colors for all ebooks

* * *

```
--RS__textColor
```

The default `color` for body copy’s text.

* * *

```
--RS__backgroundColor
```

The default `background-color` for pages.

* * *

```
--RS__selectionBackgroundColor
```

The `background-color` for selected text.

* * *

```
--RS__selectionTextColor
```

The `color` for selected text.

### Default styles for unstyled publications

#### Typefaces 

* * *

```
--RS__compFontFamily
```

The typeface for headings. The value can be another variable e.g. `var(-RS__humanistTf)`.

* * *

```
--RS__codeFontFamily
```

The typeface for code snippets. The value can be another variable e.g. `var(-RS__monospaceTf)`.

#### Typography

* * *

```
--RS__typeScale
```

The scale to be used for computing all elements’ `font-size`. Since those font sizes are computed dynamically, you can set a smaller type scale when the user sets one of the largest font sizes.

Possible values: `1` / `1.067` / `1.125` / `1.2` (suggested default) / `1.25` / `1.333` / `1.414` / `1.5` / `1.618`

* * *

```
--RS__baseFontSize
```

The default `font-size` for body copy. It will serve as a reference font all related computations.

* * *

```
--RS__baseLineHeight
```

The default `line-height` for all elements.

#### Vertical rhythm

* * *

```
--RS__flowSpacing
```

The default vertical margins for HTML5 flow content e.g. `pre`, `figure`, `blockquote`, etc.

* * *

```
--RS__paraSpacing
```

The default vertical margins for paragraphs.

* * *

```
--RS__paraIndent
```

The default `text-indent` for paragraphs.

#### Hyperlinks

* * *

``` 
--RS__linkColor
```

The default `color` for hyperlinks.

* * *

```
--RS__visitedColor
```

The default `color` for visited hyperlinks.

#### Accentuation colors

* * *

```
--RS__primaryColor
```

An optional primary accentuation `color` you could use for headings or any other element of your choice.

* * *

```
--RS__secondaryColor
```

An optional secondary accentuation `color` you could use for any element of your choice.

## Themes

Custom properties for themes are prefixed with `--RS__`.

Note these variables are publicly exposed as JSON in `css/vars` so that it’s easier to retrieve their value and use it in your codebase.

* * *

```
--RS__backgroundColor
```

The `background-color` which must be applied to the entire screen in the theme.

* * *

```
--RS__textColor
```

The `color` for text in the theme.

* * *

```
--RS__linkColor
```

The `color` for the links in the theme.

* * *

```  
--RS__visitedColor
```

The `color` for visited links in the theme.

* * *

```
--RS__selectionBackgroundColor
```

The `background-color` for selected text in the theme.

* * *

```
--RS__selectionTextColor
```

The `color` for selected text in the theme.

## User Settings

Custom properties for user settings are prefixed with `--USER__`.

* * *

```
--USER__colCount
```

The number of columns (`column-count`) the user wants displayed (one-page view, two-page spread, 3 columns, etc.).

Scope: `html`

Possible values: `integer`. Value `0` is handled as an error and resolves to `1`.

Required flag: none

Override class: Chrome advanced (optional but should be applied by any means necessary if provided to users)

To reset, remove the variable.

* * *

```
--USER__lineLength
```

The `max-width` of `body` (to shrink or grow the line-length of body copy).

Scope: `html`

It impacts `body`.

Possible values: any value CSS property `max-width|height` accepts.

Required flag: none

Override class: Chrome advanced (optional but should be applied by any means necessary if provided to users)

To reset, remove the variable.

* * *

```
--USER__backgroundColor
```

The `background-color` for the whole screen.

Scope: `html` 

It impacts all elements in the DOM.

Possible values: Color HEX (e.g. `#FFFFFF`), `rgb(a)`, `hsl`.

Required flag: none

Override class: Chrome advanced (optional but should be applied by any means necessary if provided to users)

To reset, remove the CSS variable.

* * *

```
--USER__textColor
```

The `color` for textual contents.

Scope: `html`

It impacts all elements in the DOM.

Possible values: Color HEX (e.g. `#FFFFFF`), `rgb(a)`, `hsl`.

Required flag: none

Override class: Chrome advanced (optional but should be applied by any means necessary if provided to users)

To reset, remove the CSS variable.

* * *

```
--USER__linkColor
```

The `color` for links.

Scope: `html`

It impacts all anchor elements in the DOM that have not been visited yet.

Possible values: Color HEX (e.g. `#FFFFFF`), `rgb(a)`, `hsl`.

Required flag: none

Override class: Chrome advanced (optional but should be applied by any means necessary if provided to users)

To reset, remove the CSS variable.

* * *

```  
--USER__visitedColor
```

The `color` for visited links.

Scope: `html`

It impacts all anchor elements in the DOM that have already been visited.

Possible values: Color HEX (e.g. `#FFFFFF`), `rgb(a)`, `hsl`.

Required flag: none

Override class: Chrome advanced (optional but should be applied by any means necessary if provided to users)

To reset, remove the CSS variable.

* * *

```
--USER__selectionBackgroundColor
```

The `background-color` for selected text.

Scope: `html`

It impacts all elements in the DOM.

Possible values: Color HEX (e.g. `#FFFFFF`), `rgb(a)`, `hsl`.

Required flag: none

Override class: Chrome advanced (optional but should be applied by any means necessary if provided to users)

To reset, remove the CSS variable.

* * *

```
--USER__selectionTextColor
```

The `color` for selected text.

Scope: `html`

It impacts all elements in the DOM.

Possible values: Color HEX (e.g. `#FFFFFF`), `rgb(a)`, `hsl`.

Required flag: none

Override class: Chrome advanced (optional but should be applied by any means necessary if provided to users)

To reset, remove the CSS variable.

* * *

```
--USER__textAlign
```

The alignment (`text-align`) the user prefers.

Scope: `html`

It impacts `body`, `li`, and `p` which are not children of `blockquote` and `figcaption`.

Possible values: `left` (LTR) or `right` (RTL) / `start` (logical property resolving to `left` in LTR, `right` in RTL) / `justify`

Override class: User settings advanced (optional but should be applied by any means necessary if provided to users)

Note: the value `start` can be used to let all rendering engines, excepted Trident (IE11) and EdgeHTML (Edge), automatically deal with `left` and `right` based on the direction (`dir` attribute) set for the document and its nested elements.

* * *

```
--USER__bodyHyphens
```

Enabling and disabling hyphenation.

Scope: `html`

It impacts `body`, `p`, `li`, `div` and `dd`.

Possible Values: `auto` / `none`

Override class: User settings advanced (optional but should be applied by any means necessary if provided to users)

**Warning:** for the time being, automatic hyphenation won’t work if you are using the Blink rendering engine (either via Chrome or a Webview) on ChromeOS, Linux and Windows. It indeed is not implemented yet and we recommend not trying to polyfill it using JavaScript as it will create a11y issues, especially with screen readers.

* * *

```
--USER__fontFamily
```

The typeface (`font-family`) the user wants to read with.

Scope: `html`

It impacts everything except `code `, `var`, `kbd`, and `samp`.

Possible values: `var(--RS__oldStyleTf)` / `var(--RS__modernTf)` / `var(--RS__sansTf)` / `var(--RS__humanistTf)` / `<string>`

For Japanese, possible values become: `var(--RS__serif-ja)` (horizontal writing) / `var(--RS__sans-serif-ja)` (horizontal writing) / `var(--RS__serif-ja-v)` (vertical writing) / `var(--RS__sans-serif-ja-v)` (vertical writing) / `<string>`

Required flag: `:--fontOverride`

Override class: User settings (should be applied by any means necessary)

To reset, remove the required flag.

* * *

```
--USER__fontSize
```

Increasing and decreasing the root `font-size`. It will serve as a reference for the cascade.

Scope: `html`

Possible values: percentage.

Override class: User settings (should be applied by any means necessary)

To reset, remove the required flag.

* * *

```
--USER__lineHeight
```

Increasing and decreasing leading (`line-height`).

Scope: `html`

It impacts `body`, `p`, `li` and `div`

Recommended values: a range from `1` to `2`. Increments are left to implementers’ judgment.

Override class: User settings advanced (optional but should be applied by any means necessary if provided to users)

* * *

```
--USER__paraSpacing
```

The vertical margins (`margin-top` and `margin-bottom`) for paragraphs.

Scope: `p`

Recommended values: a range from `0` to `2rem`. Increments are left to implementers’ judgment.

Override class: User settings advanced (optional but should be applied by any means necessary if provided to users)

* * *

```
--USER__paraIndent
```

The `text-indent` for paragraphs.

Scope: `p`

Recommended values: a range from `0` to `3rem`. Increments are left to implementers’ judgment.

Override class: User settings advanced (optional but should be applied by any means necessary if provided to users)

* * *

```
--USER__wordSpacing
```

Increasing space between words (`word-spacing`, related to a11y).

Scope: `h1`, `h2`, `h3`, `h4`, `h5`, `h6`, `p`, `li`, `div`

Recommended values: a range from `0` to `1rem`. Increments are left to implementers’ judgment.

Override class: User settings advanced (optional but should be applied by any means necessary if provided to users)

* * *

```
--USER__letterSpacing
```

Increasing space between letters (`letter-spacing`, related to a11y).

Scope: `h1`, `h2`, `h3`, `h4`, `h5`, `h6`, `p`, `li`, `div`

Recommended values: a range from `0` to `0.5rem`. Increments are left to implementers’ judgment.

Override class: User settings advanced (optional but should be applied by any means necessary if provided to users)

* * *

```
--USER__ligatures
```

Enabling and disabling ligatures.

Scope: `html`

It impacts all text.

Possible values: `none` / `common-ligatures`

Override class: User settings advanced (optional but should be applied by any means necessary if provided to users)

* * *

```
--USER__fontOpticalSizing
```

Enabling and disabling optical sizing (stroke optimizations).

Scope: `html`

It impacts all text.

Possible values: `none` / `auto`

Required flag: `:--fontOverride`

Override class: User settings advanced (optional but should be applied by any means necessary if provided to users)

* * *

```
--USER__fontWeight
```

Setting the weight of the variable font.

Scope: `html`

It impacts all text.

Possible values: `number`

**Warning: possible values depend on the variable font you may be using.** You can use services such as [Wakamai Fondue](https://wakamaifondue.com) to get the values.

Required flag: `:--fontOverride`

Override class: User settings advanced (optional but should be applied by any means necessary if provided to users)

* * *

```
--USER__fontWidth
```

Setting the width of the variable font.

Scope: `html`

It impacts all text.

Possible values: `ultra-condensed` / `extra-condensed` / `condensed` / `semi-condensed` / `normal` / `semi-expanded` / `expanded` / `extra-expanded` / `ultra-expanded` / `percentage`

**Warning: the percentage values depend on the variable font you may be using.** You can use services such as [Wakamai Fondue](https://wakamaifondue.com) to get the values.

Required flag: `:--fontOverride`

Override class: User settings advanced (optional but should be applied by any means necessary if provided to users)

* * *

```
--USER__blendImages
```

Blending images with the background color of the current theme.

Scope: `html`

It impacts all images.

Possible values: `readium-blend-on`

* * *

```
--USER__darkenImages
```

Darkening images.

Scope: `html`

It impacts all images.

Possible values: `readium-darken-on` / `percentage` e.g. `50%`

* * *

```
--USER__invertImages
```

Inverting colors of images.

Scope: `html`

It impacts all images, including gaiji.

Possible values: `readium-invert-on` / `percentage` e.g. `50%`

* * *

```
--USER__invertGaiji
```

Inverting colors of gaiji (valid Japanese character as image).

Scope: `html`

It impacts images with a `gaiji` class name.

Possible values: `readium-invertGaiji-on` / `percentage` e.g. `50`