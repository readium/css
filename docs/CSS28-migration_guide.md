# Migration Guide

[Implementers’ doc] [WIP]

This document aims to list changes that were made in `v.2` and how to handle them in your Reading System/apps when upgrading ReadiumCSS. 

## Removal of responsive columns

In version 1, ReadiumCSS used media queries to automatically handle the number of columns/pages to display based on certains conditions. To sum things up it switched from 1 to 2 columns when:

- the `width` of the window was large enough, based on the font-size;
- the device’s width (`device-width`) was within an arbitrary range based on the font-size, and in landscape orientation.

As a side-effect, this “auto-pagination model” (think of it as an “auto” setting for the number of columns/pages in user settings) was [not reliable enough for implementers](https://github.com/readium/readium-css/issues/143), and created issues with newer devices and form-factors (e.g. foldables). Sometimes it wouldn’t even swith to 2 columns when applying the setting because of the conditions above.

In version 2, ReadiumCSS removed these media queries and the “auto-pagination model” entirely. It applies styles the Reading System/app provides to it. Consequently, control over breakpoints is now the responsibility of the app. 

If you want to reimplement an “auto” user setting, and switch to 1 or 2 columns depending on the orientation of the device or the width of the window, you now have to handle it programmatically.

## Number of columns is no longer limited

In version 1, ReadiumCSS limited the number of columns to `1` or `2`.

In version 2, the number of columns is no longer limited. Please note value `0` is handled as an error and resolves to `1` though.

## Addition of a flag to disable vertical-writing pagination

Given the limitations of columns fragmentation in vertical writing – progression direction from top to bottom instead of right to left, columns stacked on the `y-axis` –, some Reading Systems and apps have been disabling it, and implement their own logic.

Since pagination is the default view, it is now possible to disable it by appending `--RS__disablePagination: readium-noVerticalPagination-on` on the `:root` (`html`) element.

## Removal of -webkit-perspective hack for older versions of Chromium

The following hack was used in version 1:

```
:root {
  -webkit-perspective: 1;
}
```

The issues it resolves are described in [CanIUse’s “known issues” for CSS Multicolumn](https://caniuse.com/multicolumn#bugs):

> Chrome is reported to incorrectly calculate the container height, often breaks on margins and padding, and can display one pixel of the next column at the bottom of the previous column. Some of these issues can be solved by adding `-webkit-perspective: 1;` to the column container. This creates a new stacking context for the container, and apparently causes Chrome to (re)calculate column layout.

That hack created a [performance issue for large HTML documents](https://github.com/readium/readium-css/issues/117) as a side-effect though, and it was consequently removed in version 2, especially as it was no longer needed.

Blink/Chromium switched to their new LayoutNG for columns in version `v.106.0.5245.0`. This means that if you have to deal with versions below, you have to re-implement this CSS hack specifically for these – and their older layout engine.

It could be something as simple as appending the style to the `html` element:

```
<html style="-webkit-perspective: 1">
```

or adding it in `head`:

```
<head>
  ...
  <style type="text/css">
    :root {
      -webkit-perspective: 1;
    }
  </style>
  ...
</head>
```

## Replacement of page margins user setting with line length user setting

In version 1 ReadiumCSS implemented a page margins user setting: `--USER__pageMargins`. 

This is no longer supported in version 2, as it has been replaced with a user setting for the line length of body copy (i.e. the `max-width` of the `body` element). `--USER__lineLength` should now be used.

The user setting should consequently be updated, either in the form of replacement or mimicking of the old one.

It is indeed possible to re-implement the page margins user setting by using the new variable, given margin will adjust automatically to the line length, but this also means that your updated logic will have to work backwards: 

- in version 1, you would just decrease/increase the value of `--USER__pageMargins`.
- in version 2, you would decrease `--USER__lineLength` to increase page margins, and increase `--USER__lineLength` to decrease page margins.

Otherwise, the line-length user setting can be a set of predefined values, a range, etc. It accepts the values that the CSS properties `max-width|height` do.

As a side effect, `--RS__pageGutter` is now set to `0` as default. This means no `padding` is applied to neither the `:root` nor `body` elements. This is to make sure ReadiumCSS gives you what you expect when applying the setting, w/o anything creating inconsistencies and unreliabilities.

You can set the value yourself so that you are aware of it, or design the setting logic around it. 

This setting will be applied in all conditions (1 or 2-col pagination, scroll) so you might want to make sure it can work for all three, and maybe adjust the values accordingly.

## Improvement of overflow

Version 2 ships with a couple of improvements specific to `overflow`.

In version 1, some longer strings the rendering engine could not break and wrap would be visibly overflowing in the next column. In version 2, this is now clipped/hidden at the `body` level, in line with what other Reading Systems have been doing to mitigate this issue. 

As a consequence, you should check whether this impacts progression within XHTML documents, depending on your implementation of gestures, taps, etc.

If you already solved this issue by adding some styles for `overflow`, you may also have to remove these styles if possible, or report possible issues and malfunctions so that ReadiumCSS can improve `overflow` management more reliably.

## Re-implementation of the font-size user setting

In version 1, ReadiumCSS had to rely on the `:root`’s `font-size` and the cascade. In order to make it reliable, a font-normalization patch was used to get around author stylesheets’ using absolute values like `px` or `pt`. This created important side effects and their resolution was long overdue.

In version 2, ReadiumCSS switched to `zoom`, which makes the patch no longer needed, except for rendering engines/browsers that don’t support this CSS property.

It doesn’t need any change at the implementation level, and should work out of the box. All is handled behind the scenes in ReadiumCSS font-size module.

As a side-effect of this new implementation, please note the `--USER__typeScale` setting is no longer available.

Due to iPadOS “desktop-class experience” interventions, a patch has to be applied when the site is requested (by default) in desktop version, and only in this version (mobile website is fine without it). The selector for the flag can be configured (`:--ipadOS-patch`) and is `[style*="readium-iPadOSPatch-on"]` by default.

Starting version `2.0.0-beta.12` the previous and deprecated implementation of font-size is exposed under a flag that can be configured (`:--deprecated-font-size`) and is `[style*="readium-deprecatedFontSize-on"]` by default. This can be used if you need some time to switch to the new implementation, or simply prefer to use the old one. The font-size normalize is no longer applied by default though, and is relying on another flag (`:--fs-normalize`) with `[style*="readium-normalize-on"]` as default.

Note that when zoom is not supported, the setting will automatically switch to the previous implementation. Once again, you need to manually apply the font-size normalization as you see fit.

## Extension of the font-family user setting override

In version 1, the font-family user setting overrode a selection of elements of body copy e.g. `p`, `li`, `dt`, etc. This explained why the font-family of headings would remain the same as the one set in authors’ stylesheets for instance.

In version 2, the logic has changed and the override will now apply to everything except a handful of tags e.g. `code`, `var`, `samp`, and `kbd`. It is actually borrowed from the accessibility fonts and normalization module.

## Updated default font stacks

The default font stacks for latin in `ReadiumCSS-base` module have been updated to benefit from newer fonts on the Windows platform. They have also been extended to offer better coverage for Linux distributions, with project [modern font stacks](https://modernfontstacks.com) as a reference.

## Updated recommandations for libre and open source fonts

Typeface Clear Sans has been replaced with IBM Plex Sans, the former project having been archived, with no more design and development happening in the future.

Luciole Vision and Atkinson Hyperlegible have been added to the list of recommended fonts for accessibility. Due to its unknown copyright, font [Maqroo](https://maqroo.com) couldn’t be added to this list for arabic.

## Support for variable fonts

In version 2, ReadiumCSS provides support for three registered (read common) axes so that you can expose them as user settings. 

1. `--USER__fontWeight`
2. `--USER__fontWidth`
3. `--USER__fontOpticalSizing`

These are documented in [User Settings, Reading Modes, and Themes](CSS12-user_prefs.md#font-variations).

To help implementers, a new document specific to [variable fonts](CSS10b-variable_fonts.md) has been created. It explains the challenges they’ll encounter, and lists a selection of open source and libre fonts they can embed in their Reading Systems/Apps.

While it’s possible to provide users with a complete selection of variable fonts, implementation will be limited to font-weight (`--USER__fontWeight`) as it’s the most common axis all fonts support.

If you want to implement the other two, you will have to do so on a variable font basis.

## Addition of a fonts patch for Android

This patch is intended to fix a [Fixed-Layout issue on Android](https://github.com/readium/readium-css/issues/149), and only on this platform. **It doesn’t apply to reflowable EPUBs or any other platform.**

It declares fully metric compatible open source fonts alternatives (Nimbus Roman and Nimbus Sans) as the font-families that generic font-family `serif` and `sans-serif` are usually resolving to on other platforms. Droid Serif and Roboto are not, which creates issues with text that is absolutely positioned in Fixed-Layout e.g. overlapping or overflowing text, etc.

The logic for loading this patch is up to implementers.

## Public exposition of some Reading System Variables

Since version `2.0.0-alpha.8`, ReadiumCSS is exposing variables for pagination, default font-stacks, and day, sepia, and night modes, in JSON form.

This is intended to make it easier for consumers to retrieve important values they need w/o having to get it from the DOM at runtime. For instance, this can be leveraged to keep the theme of the UI and contents in sync (colors and typeface).

For instance, in NodeJS, you would add ReadiumCSS to your dependencies then import it like this:

```
import sepiaMode from "readium-css/css/vars/sepia.json";

const sepiaBackground = sepiaMode.sepiaMode.RS__backgroundColor;
```

## Theming Improvements

Since version `2.0.0-alpha.10`, ReadiumCSS is enforcing the color of links if their custom properties are set on `:root/html`, and exposing the blending, darkening, and inverting of images globally. 

The motivation is to make life of consumers a little bit easier when it comes to creating custom themes.

Previously, you had to rely on day, sepia, and night mode to enforce the color of links and benefit from their specific image flags/features. 

These decisions are now made to consumers’ discretion, which means they can invert images in their darkest custom themes without having to override ReadiumCSS’ night mode colors for instance, or offer these features to users as they see fit – globally or scoped to a subset of themes – in their app. 

**Note you’ll have to take gaiji into account in dark custom themes as inverting them so that they match the color of text can only be done automatically in readiumCSS’ own night mode.**

## Removal of Dynamic Leading

Since version `2.0.0-beta.6`, ReadiumCSS is no longer using an algorithm to guess the ideal line-height for each font, and recompute it on font-size change, as it created issues with the new font-size setting implementation. 

It simply uses value `1.5` for [accessibility purposes](https://developer.mozilla.org/en-US/docs/Web/CSS/line-height#accessibility), and compensates this value for various languages (e.g. CJK).

## Removal of advanced settings flag

Since version `2.0.0-beta.7`, ReadiumCSS is no longer requiring the advanced flag `--USER__advancedSettings: readium-advanced-on` to be appended for advanced user settings (e.g. line-height, text-align, letter-spacing, etc.).

These settings now work without the flag. This provides with more flexibility since implementers can now pick what they want to put under publisher’s styles, should they have such a toggle.

It’s been replaced with the flag `--USER__fontSizeNormalize: readium-normalize-on`, whose purpose is to simply force ReadiumCSS 1’s normalization so that the font-size user setting can be guaranteed to work on all publications, even if the book’s font-sizing is styled using absolute units. 

This repurposed flag can be appended as you see fit, when CSS property `zoom` is not supported: you can present it as a toggle to users, or append it programmatically, or append it automatically, etc.

## Removal of line-height compensation for A11y fonts and normalization

Since version `2.0.0-beta.11`, ReadiumCSS no longer applies a line-height compensation when AccessibleDfA and IA Writer Duospace are the current user font, or the accessibility normalize flag is set.

That was a side-effect that could be surprising to implementers, and impacting their line-height user setting experience.