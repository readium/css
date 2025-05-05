# Inject and paginate EPUB contents

[Implementers’ doc] [Authors’ info]

## Injection

Depending on the platform and version you’re developing for, contents must be injected into: 

- a web view;
- a chrome view;
- an iframe.

Indeed, we must provide authors with a reliable context in which their styles and scripts are scoped.

### Margins and dimensions

Since we must take viewport units into account, especially `vh` (viewport height), at least the top and bottom margins must be set on this container, and not inside it.

You may also want to set left and right margins on this container so that all margins are equal in the two-column view.

Finally, on larger screens, you’ll have to set dimensions on this container so that it doesn’t become too large.

### Background color

Please note you must deal with the `background-color` outside this container, especially as the user can set reading modes (night, sepia, etc.). In other words, it must be synced with this user setting so that the entire screen is the same `background-color`.

As a friendly reminder, you can allow transparency for the iframe if you’re using one. That should help deal with `background-color` at the global level.

```
<iframe src="source.xhtml" allowtransparency="true"></iframe>
```

Then set the `--RS__backgroundColor` variable to `transparent` in `ReadiumCSS-base.css`, although you will have to modify the current user settings stylesheet so that it can work this way.

## Pagination

Contents are paginated using [CSS multicolumns](https://www.w3.org/TR/css3-multicol/), for several reasons: 

- [it’s been cross-platform for a long time](http://caniuse.com/#feat=multicolumn);
- it’s responsive;
- it’s tried and tested;
- it brings some kind of interoperability since it has been used by a lot of Reading Systems and authors have been designing against them.

### Default

Pagination is a single column by default, which means the Reading System/app is responsible for its responsiveness.

For instance, if the reader is using a tablet in landscape mode and you want to display two “pages”/columns automatically, you have to tell ReadiumCSS by applying `--USER__colCount: 2;` to the `:root` element – if it’s not already set by this user of course.

This is a major change from version 1, as the responsive aspect of pagination was built-in.

### The RS owns :root and part of body

Since we must inject contents and columns are implemented at the `:root` level (i.e. `html`), the Reading System owns the entire styling for this selector.

Font size is an important metric since the responsive design relies entirely on `rem` (root `em`) so this style must be enforced by any means necessary.

For `body`, we own: 

- `overflow`;
- sizing: `(min-|max-)width`, `(min-|max-)height`, `box-sizing`;
- spacing: `margin` and `padding`.

You can control horizontal margins in several ways: 

1. using `column-gap` and `padding` for `:root`;
2. using `column-gap` and `margin` for the web view/chrome view/iframe;
3. using `padding` for `:root` and/or `body`.

Please note that when using `padding`, you must take it into account when sizing `:root` and/or `body`. Their widths contain the padding set for the element.

### The pagination model

This is the model you’re dealing with. It’s been simplified in version 2 in order to be more reliable.

![The single page model relies on the column width of the :root element. Line-length is constrained by the max-width of the body element, including its padding. Finally an auto margin centers the content.](assets/Page-Model.jpg)

Page gutters are part of `body` (`--RS__pageGutter`), hence `--USER__lineLength` (or `--RS__defaultLineLength` if no user preference is set). Contents are centered in `:root` using the `auto` value for `body` margins.

By default, `--RS__pageGutter` is set to `0`. You can set it as you wish, but take into account it will substract from `--USER__lineLength`. 

#### Variables you can set

Please note those variables’ value can be redefined using media queries. You don’t need to redeclare entire declarations.

* * *

```
--RS__colWidth
```

The optimal column’s width. We set it to `100%` (`100vh` in vertical-writing) for a single-column for Safari – otherwise it won’t fragment content, and `auto` for multiple so that the column-count can be prioritized.

* * *

```
--RS__colCount
```

The optimal number of columns (depending on the columns’ width).

* * *

```
--RS__colGap
```

The gap between columns. It must be set in pixels so that it won’t resize with font size. 

You must account for this gap when scrolling.

* * *

```    
--RS__pageGutter
```

The inline (horizontal by default, vertical in vertical-writing) page margins. It must be set in pixels so that it won’t resize with font size.

* * *

```
--RS__defaultLineLength
```

The default line-length when none is set by the user. It should be set in `rem` in order to take `:root`’s `font-size` as a reference, whichever the `body`’s `font-size` might be.

* * *

```
--USER__lineLength
```

The line-length set by the user. It can be set in any unit CSS property `max-width` accepts.

### Right-to-left progression

The pagination model will take care of itself if the correct `dir` attribute is set on `html` and `body`.

In other words, if `dir="rtl"` is set for both elements, the column-progression will be automatically reversed.

#### When to use the Right-to-left progression

What implementers need to do:

1. check the `page-progression-direction` for the `spine` item;
2. check the language – do not forget there can be multiple `<dc:language>` items;
3. load specific styles for RTL scripts;
4. append `xml:lang` and/or `lang` attribute if it’s missing in XHTML documents;
5. append `dir="rtl"` attributes if they’re missing for both `html` and `body` in XHTML documents;
6. load specific fonts’ lists for user settings, based on the primary language of the publication;
7. add/remove specific user settings, based on the primary language of the publication;
8. Apply the correct `page-progression-direction` (in RTL, next resource is on the left, previous is on the right);
9. change the direction of the toc and at least some pieces of user settings (e.g. `text-align`).

The current implementation is limited to the following combinations:

| Language          | IANA tag | page-progression-direction | dir attribute |
|-------------------|----------|----------------------------|---------------|
| Arabic            | ar       | RTL                        | rtl           |
| Farsi (Persian)   | fa       | RTL                        | rtl           |
| Hebrew            | he       | RTL                        | rtl           |

[IANA Language Subtag registery](https://www.iana.org/assignments/language-subtag-registry/language-subtag-registry).

We may add others at some point in the future. Please feel free to report the languages or scripts missing in this mapping. Please bear in mind a list of default (preferably system) fonts will greatly help to add support for those languages and scripts. See [Default Fonts](../docs/CSS09-default_fonts.md).

Test files can be retrieved from [the Readium CSS’ i18n-samples OPDS feed](https://raw.githubusercontent.com/readium/css/develop/docs/i18n-samples/root.atom).

#### Be cautious, the direction propagates

As explicitly stated in [CSS Writing Modes Level 3](https://www.w3.org/TR/css-writing-modes-3/#principal-flow):

> As a special case for handling HTML documents, if the `:root` element has a `<body>` child element, the principal writing mode is instead taken from the values of `writing-mode` and `direction` on the first such child element instead of taken from the root element.

What this means is that the `dir` attribute (or the `direction` CSS property) set for `body` will override the one set for `html`. Unlike most other CSS properties, which don’t impact the parent element, the `dir` attribute (or the `direction` CSS property) propagates in this very specific case:

```
<html dir="ltr">
  <body dir="rtl">
   <!-- dir="rtl" should be used. -->
```

```
html {
  direction: ltr;
}

body {
  direction: rtl;
  /* rtl propagates to html and overrides ltr.
     You can think of it as a JS event bubbling up if that makes more sense. */
}
```

We MUST consequently force the direction for all documents in the publication, and can’t manage `ltr` documents in a `rtl` publication.

Note: While this isn’t necessarily the case in practice, in Blink, Gecko/Quantum and Webkit, and you can emulate a reversed column-progression for `ltr` documents in a `rtl` publication, this behavior may change in the future.

### The pagination model for vertical writing modes

When publications are in Chinese, Japanese, Korean, and Mongolian, and laid out with a `vertical-*` writing mode, we must switch to a different model of pagination.

Indeed, columns are automatically laid out on the `y-axis` (vertical) with such writing modes, and [the behavior of multi-column in orthogonal flows has been deferred to CSS Writing Modes Level 4](https://www.w3.org/TR/css-writing-modes-3/#changes-201512). This means we must stick to a single column, and can’t support several columns – they are stacked on top of one another, which is not what is expected.

This also implies the scroll progression is vertical, hence horizontal navigation/swipes have to be re-mapped on this `y-axis`. You may also want to disable animations so that it doesn’t feel disorienting to users.

We consequently use a “Fragmented Model”, as it differs significantly from the “Pagination Model”, especially the column-axis.

![The fragmented Model is kind of a superset of the single page model in the vertical direction, with extra padding added to the root element for extra horizontal gutters.](assets/Fragmented-Model.jpg)

One can think of the fragmented model as the single page model rotated 90% clockwise.

Due to the limitations listed above, implementers may want to use their own model. It is not uncommon to handle vertical writing pagination programmatically, as it can be done relatively easily and efficiently thanks to characters being (mostly) monospace e.g. scrolling the viewport by an offset based on these characters.

Since pagination is the default view, if you don’t want to use this model and implement yours, you can set `--RS__disablePagination: readium-noVerticalPagination-on` on the `:root` (`html`) element.

#### When to use the fragmented model

What implementers need to do:

1. check the `page-progression-direction` for the `spine` item;
2. check the language – do not forget there can be multiple `<dc:language>` items;
3. load the specific styles for CJK if needed;
4. append `xml:lang` and/or `lang` attribute if it’s missing in XHTML documents;
5. load specific fonts’ lists for user settings, based on the primary language of the publication;
6. add/remove specific user settings, based on the primary language of the publication;
7. Apply the correct page-progression-direction (in RTL, next resource is on the left, previous is on the right).

Here is the correct mapping for combinations resulting in the `vertical-*` writing mode:

| Language              | IANA tag | page-progression-direction | Writing-mode  |
|-----------------------|----------|----------------------------|---------------|
| Chinese               | zh       | RTL                        | vertical-rl   |
| Chinese (Traditional) | zh-Hant  | RTL                        | vertical-rl   |
| Chinese (Taiwan)      | zh-TW    | RTL                        | vertical-rl   |
| Chinese (Hong Kong)   | zh-HK    | RTL                        | vertical-rl   |
| Korean                | ko       | RTL                        | vertical-rl   |
| Japanese              | ja       | RTL                        | vertical-rl   |
| Mongolian             | mn-Mong  | LTR / Default / None       | vertical-lr   |

[IANA Language Subtag registery](https://www.iana.org/assignments/language-subtag-registry/language-subtag-registry).

Test files can be retrieved from [the Readium CSS’ i18n-samples OPDS feed](https://raw.githubusercontent.com/readium/css/develop/docs/i18n-samples/root.atom).

#### When not to use the fragmented model

If a publication doesn’t need to be laid out in a `vertical-*` writing mode, the default pagination model must be used.

There are still specific styles for CJK Horizontal to load though.

Here is the correct mapping for combinations resulting in the `horizontal-tb` writing mode:

| Language              | IANA tag | page-progression-direction | Writing-mode  |
|-----------------------|----------|----------------------------|---------------|
| Chinese               | zh       | LTR / Default / None       | horizontal-tb |
| Chinese (Simplified)  | zh-Hans  | LTR / Default / None       | horizontal-tb |
| Chinese (Taiwan)      | zh-TW    | LTR / Default / None       | horizontal-tb |
| Chinese (Hong Kong)   | zh-HK    | LTR / Default / None       | horizontal-tb |
| Korean                | ko       | LTR / Default / None       | horizontal-tb |
| Japanese              | ja       | LTR / Default / None       | horizontal-tb |
| Mongolian             | mn-Cyrl  | LTR / Default / None       | horizontal-tb |

[IANA Language Subtag registery](https://www.iana.org/assignments/language-subtag-registry/language-subtag-registry).

#### Be cautious, the writing-mode CSS property propagates

As explicitly stated in [CSS Writing Modes Level 3](https://www.w3.org/TR/css-writing-modes-3/#principal-flow):

> As a special case for handling HTML documents, if the `:root` element has a `<body>` child element, the principal writing mode is instead taken from the values of `writing-mode` and `direction` on the first such child element instead of taken from the root element.

What this means is that the `writing-mode` declared for `body` will override the one declared for `html`. Unlike most other CSS properties, which don’t impact the parent element, `writing-mode` propagates in this very specific case:

```
html {
  writing-mode: horizontal-tb;
}

body {
  writing-mode: vertical-rl;
  /* vertical-rl propagates to html and overrides horizontal-tb.
     You can think of it as a JS event bubbling up if that makes more sense. */
}
```

We MUST consequently force the `writing-mode` for all documents in the publication, and can’t manage `horizontal-tb` documents in a `vertical-rl` publication.

### Patch and safeguards

We’ve designed two extras for pagination: 

1. a patch for HTML5 Suggested Rendering, which takes care of paged media;
2. safeguards, which make sure some elements will be managed as expected by authors in columns.

#### Patch

The HTML5 patch deals with: 

- fragmentation (`widows`, `orphans` and `page-break`);
- hyphenation;
- open type features;
- horizontal margins (pixels have been converted to %);
- normalization of `abbr` and `wbr`.

You can use it with or without pagination, it should not make any difference.

#### Safeguards

Safeguards deal with:

- media sizing (e.g. `img`, `svg`, `audio`, `video`);
- word wrap for long strings (headings and links);
- large table’s overflow.

Once again, you can use it with or without pagination, it should not make any difference.

##### Variables you can set

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
