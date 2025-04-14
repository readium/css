# User Settings, Reading Modes and Themes

[Implementers’ doc] [Authors’ info]

The idea is:

1. appending/removing flags and CSS variables for user settings (inline style on `html`);
2. managing user settings entirely via CSS so that we don’t need to manipulate the DOM too much.

There are alternatives approaches you can adopt if this one doesn’t fit.

**Note:** Possible values are strict i.e. implementers can’t use any other value; recommended values are loose i.e. they are left to implementers’ judgment.

## Mechanism for user settings

The `ReadiumCSS-after.css` stylesheet, which contains user settings, can be appended before runtime; its declarations won’t be applied until user variables are set. 

User settings require the following process: 

1. add the flag and its value to `html` when applicable (font override, a11y normalization);
2. add the setting-specific variable and its value to `html`;
3. styles are updated live.

The selectors used in user settings are indeed “conditional”, styles are applied if the variable (or a specific value for reading modes) is set as an inline style in `html` (`:root`).

### Setting and removing a variable

#### Setting

```
var root = document.documentElement; 

root.style.setProperty("name of var", "value");
```

You don’t need to remove the variable before setting another value, the new value will simply override the existing one.

#### Removing

You can either remove the style explicitly with `removeProperty()`:

```
var root = document.documentElement; 

root.style.removeProperty("name of var");
```

Or implicitly by using an empty string as a value with `setProperty()`:

```
var root = document.documentElement; 

root.style.setProperty("name of var", "");
```

Setting a property with an empty string as the value will indeed invoke `removeProperty()`, as defined in the [CSS Object Model Spec](https://drafts.csswg.org/cssom/#dom-cssstyledeclaration-setproperty).

## Flags

Some variables behave like flags. You could also use custom `data-*` attributes or CSS classes to manage the following ones. See the [“Quickstart” doc](../docs/CSS02-quickstart.md) for customization.

By default, those flags are not set. Then their initialization depends on your user settings’ management e.g. apply user settings to all EPUBs, only the ones that have already been customized, etc.

### User view

Allows to switch between paged and scroll view.

```
--USER__view
```

Supported values: `readium-paged-on` | `readium-scroll-on`

Override class: Chrome (should be applied by any means necessary)

If the flag is not set, ReadiumCSS will fall back to the paged view.

### Font Family override

Acts as an explicit switch to override the publisher’s `font-family`.

```
--USER__fontOverride
```

Supported value: `readium-font-on`

Override class: None. This flag is required to change the `font-family` user setting.

To switch back to the publisher’s font, you can either set an empty string as a value or remove the property.

### Font Size Normalization

Acts as an explicit switch to force font-normalization in publications whose font-sizing is declared using CSS absolute units, breaking the font-size user setting in engines that don’t support CSS property `zoom`.

```
--USER__fontSizeNormalize
``` 

Supported value: `readium-normalize-on`

Override class: None.

### iPadOS Zoom Patch

Acts as an explicit switch to force iPadOS patching of zoom issues so that `--USER__fontSize` can work as expected. This should be applied only when the site is requested in its desktop version on iPadOS – mobile version is completely fine.

```
--USER__iPadOSPatch
```

Supported value: `readium-iPadOSPatch-on`

Override class: None.

### Reading Modes

We currently have two reading modes for night and sepia.

```
--USER__appearance
```

Supported values: `readium-day-on` | `readium-sepia-on` | `readium-night-on`

Override class: Chrome (should be applied by any means necessary)

If the flag is not set, ReadiumCSS will fall back to the day mode.

### Filters

Please note night mode provides two extra specific variables: 

```
--USER__darkenFilter
```

Supported value: `readium-darken-on`

To disable the filter, you can either set an empty string as a value or remove the property.

```
--USER__invertFilter
```

Supported value: `readium-invert-on`

Override class: Chrome advanced (optional but should be applied by any means necessary if provided to users)

To disable the filter, you can either set an empty string as a value or remove the property.

### Accessibility Normalization

Users may want to normalize text (no bold, no italics, etc.) for accessibility reasons, using a non a11y-specific typeface.

```
--USER__a11yNormalize
```

Supported value: `readium-a11y-on`

To disable the normalization, you can either set an empty string as a value or remove the property.

### Hiding Ruby Text

Users may want to hide ruby annotations for accessibility reasons.

```
--USER__no-ruby
```

Supported value: `readium-noRuby-on`

To disable the hiding and show ruby annotations, you can either set an empty string as a value of remove the property.

## List of variables 

### Layout 

The user can set the number of columns and line length.

#### Number of columns

```
--USER__colCount
```

Possible values: `integer`

Required flag: none

Override class: Chrome advanced (optional but should be applied by any means necessary if provided to users)

To reset, remove the variable.

By default, this setting behaves as `1`. Value `0` is handled as an error and resolves to `1`.

It is up to implementers to decide whether they want this setting to be available and override any configuration or only some (e.g. setting only available in landscape and/or larger screens).

#### Line length

```
--USER__lineLength
```

Possible values: any value CSS property `max-width|height` accepts.

Required flag: none

Override class: Chrome advanced (optional but should be applied by any means necessary if provided to users)

To reset, remove the variable.

### Themes

The user can set at least a `background-color` and `color`. 

At minimal, the following two variables should therefore must be used together.

```
--USER__backgroundColor
--USER__textColor
```

You can use 4 other properties to handle the color of links and selection:

```
--USER__linkColor
--USER__visitedColor
--USER__selectionBackgroundColor
--USER__selectionTextColor
```

It’s up to implementers to decide whether they want to expose these as user settings i.e. for power/advanced users, or set them after deriving the value from background and text color (e.g. a contrast algorithm). 

Possible values: Color HEX (e.g. `#FFFFFF`), `rgb(a)`, `hsl`.

Required flag: none

Override class: Chrome advanced (optional but should be applied by any means necessary if provided to users)

To reset, remove both variables.

### Hyphenation and justification

The user can set `text-align` and `hyphens` for body copy contents.

#### Text align

```
--USER__textAlign
```

Possible values: `left` (LTR) or `right` (RTL) | `start` (logical property resolving to `left` in LTR, `right` in RTL) | `justify`

Override class: User settings advanced (optional but should be applied by any means necessary if provided to users)

Note: the value `start` can be used to let all rendering engines, excepted Trident (IE11) and EdgeHTML (Edge), automatically deal with `left` and `right` based on the direction (`dir` attribute) set for the document and its nested elements.

#### Hyphens

```
--USER__bodyHyphens
```

Possible Values: `auto` | `none`

Override class: User settings advanced (optional but should be applied by any means necessary if provided to users)

**Warning:** for the time being, automatic hyphenation won’t work if you are using the Blink rendering engine (either via Chrome or a Webview, including Electron’s) on ChromeOS, Linux and Windows. It indeed is not implemented yet and we recommend not trying to polyfill it using JavaScript as it will create a11y issues, especially with screen readers. 

**As a consequence, we strongly advise implementers against providing users with an hyphenation-specific setting if targeting this rendering engine.**

### Typography

The user can set `font-family`, `font-size` and `line-height` for body copy contents.

#### Font family

```
--USER__fontFamily
```

Possible values: `var(--RS__oldStyleTf)` | `var(--RS__modernTf)` | `var(--RS__sansTf)` | `var(--RS__humanistTf)` | `<string>`

For Japanese, possible values become: `var(--RS__serif-ja)` (horizontal writing) | `var(--RS__sans-serif-ja)` (horizontal writing) | `var(--RS__serif-ja-v)` (vertical writing) | `var(--RS__sans-serif-ja-v)` (vertical writing) | `<string>`

Required flag: `--USER__fontOverride: readium-font-on`

Override class: User settings (should be applied by any means necessary)

To reset, remove the required flag.

#### Font size

In version 1, we had to normalize `font-size` for body copy elements so that it could work in pure CSS. In order to do so, we were using a normalize, and the `--USER__advancedSettings: readium-advanced-on` inline style needed to be set for `html` in order for the font-size setting to work.

Although this approach was backed by actual data (published books), it was an issue to authors and, occasionally, readers too.

In version 2, this normalization is deprecated, and will only be used behind the scenes when there is no other way to make the font-size setting work reliably, using the new flag `--USER__fontSizeNormalize: readium-normalize-on`.

```
--USER__fontSize
```

Recommended values: a range from `75%` to `250%`. Increments are left to implementers’ judgment.

Override class: User settings (should be applied by any means necessary)

**Note: iPadOS needs a patch when the site is requested in its desktop version. It is activated with the `readium-iPadOSPatch-on` flag.**

#### Line height

```
--USER__lineHeight
```

Recommended values: a range from `1` to `2`. Increments are left to implementers’ judgment.

Override class: User settings advanced (optional but should be applied by any means necessary if provided to users)

### Paragraphs’ formatting

The user can set `margin-top`, `margin-bottom` and `text-indent` for paragraphs. 

#### Paragraphs’ spacing

```
--USER__paraSpacing
```

Recommended values: a range from `0` to `2rem`. Increments are left to implementers’ judgment.

Override class: User settings advanced (optional but should be applied by any means necessary if provided to users)

#### Paragraphs’ indent

```
--USER__paraIndent
```

Recommended values: a range from `0` to `3rem`. Increments are left to implementers’ judgment.

Override class: User settings advanced (optional but should be applied by any means necessary if provided to users)

### Characters’ spacing

The user can set `word-spacing` and `letter-spacing` for headings and body copy contents.

#### Word spacing

```
--USER__wordSpacing
```

Recommended values: a range from `0` to `1rem`. Increments are left to implementers’ judgment.

Override class: User settings advanced (optional but should be applied by any means necessary if provided to users)

#### Letter spacing

```
--USER__letterSpacing
```

Recommended values: a range from `0` to `0.5rem`. Increments are left to implementers’ judgment.

Override class: User settings advanced (optional but should be applied by any means necessary if provided to users)

#### Arabic Ligatures

```
--USER__ligatures
```

Possible values: `none` | `common-ligatures`

Override class: User settings advanced (optional but should be applied by any means necessary if provided to users)

### Font variations

If a variable font is available and is currently used, the user can disable its optical sizing, and set its `weight` and `width`.

**Warning: All fonts don’t support all these variations.** ReadiumCSS provides these user settings for convenience but their implementation and use depends on the variable fonts you ship in your app. By very far, the most common variation is `weight` and may be considered a common denominator. 

#### Font Optical Sizing

```
--USER__fontOpticalSizing
```

Rendering engines and browsers enable optical sizing by default for fonts that have an optical size variation axis.

When optical sizing is used, small text sizes are often rendered with thicker strokes and larger serifs, whereas larger text is often rendered more delicately with more contrast between thicker and thinner strokes.

Possible values: `none` | `auto` (default)

Required flag: `--USER__fontOverride: readium-font-on`

Override class: User settings advanced (optional but should be applied by any means necessary if provided to users)

#### Font Weight

```
--USER__fontWeight
```

Possible values: `number` e.g. `230`, `400`, `750`

**Warning: possible values depend on the variable font you may be using.** You can use services such as [Wakamai Fondue](https://wakamaifondue.com) to get the values.

Required flag: `--USER__fontOverride: readium-font-on`

Override class: User settings advanced (optional but should be applied by any means necessary if provided to users)

#### Font Width

```
--USER__fontWidth
```

Possible values: `ultra-condensed` | `extra-condensed` | `condensed` | `semi-condensed` | `normal` | `semi-expanded` | `expanded` | `extra-expanded` | `ultra-expanded` | `percentage` e.g. `50%`, `125%`

**Warning: the percentage values depend on the variable font you may be using.** You can use services such as [Wakamai Fondue](https://wakamaifondue.com) to get the values.

Required flag: `--USER__fontOverride: readium-font-on`

Override class: User settings advanced (optional but should be applied by any means necessary if provided to users)

## Themes

In this model, themes are just a set of user variables with specific values.

It becomes even easier to override them for the user as the values are already user settings.

In other words, think of preset and custom themes as a set of variables, which makes it easier to create, manipulate and cache them.

### Theming Features

Filters are available for theming purposes so that you can handle images more precisely. 

#### Blending images

```
--USER__blendImages
```

Possible values: `readium-blend-on`.

This will apply a `mix-blend-mode` of `multiply` with a transparent background to blend images with a white background with the background-color of your theme. 

#### Darkening images

```
--USER__darkenImages
```

Possible values: `readium-darken-on` | `percentage` e.g. `50%`.

This will apply a `brightness` filter with the percentage value it’s given, or a preset of `80%` if using it as a flag. 

#### Inverting images (and/or Gaiji)

```
--USER__invertImages
```

Possible values: `readium-invert-on` | `percentage` e.g. `50%`.

This will apply an `invert` filter with the percentage value it’s given, or a preset of `100%` if using it as a flag.

If you want to only invert gaiji (valid Japanese character as `img`), you can use:

```
--USER__invertGaiji
```

Possible values: `readium-invertGaiji-on` | `percentage` e.g. `50%`.

This will apply an `invert` filter with the percentage value it’s given, or a preset of `100%` if using it as a flag, only to `img class="gaiji"`.

## Alternative options

There is not a lot of alternatives when it comes to managing user settings. Options include:

- appending/removing stylesheets (either `link` or `style` element) dynamically;
- traversing the DOM and appending inline styles using JavaScript;
- using classes or custom attributes for a limited subset of settings (e.g. reading modes);
- leveraging native features web views have to offer.

Please bear in mind Readium CSS provides a baseline, it resonably manages all those issues using CSS only. But if you want to offer users the most advanced experience there can be, you’ll end up with a mix of all those options.

For instance, you can’t really manage `text-align` perfectly if you don’t traverse the DOM to find elements for which the user setting should not apply, CSS has no way to retrieve those elements.

It is worth mentioning that at least some rendering engines are optimized to manage **global** CSS variables (i.e. the ones declared in `:root`) and reserve a special cache for faster lookup and updates. Changes should consequently be handled as inline styles in the `html` element if you want the best performance possible.

## User settings can be language-specific

It is important to note that the list of user settings you may provide users with can change depending on the primary language of the publication.

Indeed, it doesn’t make sense to have some user settings in some languages, and they would do more harm than good e.g. hyphens in CJK. Ideally, those settings should therefore be removed from the UI, or at least disabled, if needed.

### All languages other than Latin

Implementers will need to load different list of fonts based on the languages listed in [Default Fonts](../docs/CSS09-default_fonts.md).

The most complex issue is finding fonts for those languages, especially as mobile systems often ship with the minimum amount of fonts possible to support Indic, Arabic, Hebrew, CJK, etc. And when the platform provides an extended selection, users often have to download them beforehand.

The following is provided as guidance only:

1. the app should at least offer the publisher’s font and the default (`var(--RS__baseFontFamily)`) for the language – which should work automatically if the correct language is set for each document;
2. if implementers want to extend the list:
   1. use pre-installed fonts if the system offers some;
   2. use downloadable fonts if the system offers some;
   3. carefully pick fonts supporting the language and the idiosyncrasies of its typography;
   4. fall back to [Google Noto Fonts](https://www.google.com/get/noto/).
3. users probably have fonts already installed, re-use those fonts if possible (advanced setting in which they can access or declare those fonts).

### Right to left scripts

User settings to disable are:

- `--USER__bodyHyphens`;
- `--USER__wordSpacing`;
- `--USER__letterSpacing`.

User settings to add are:

- `--USER__ligatures`.

### CJK

For Chinese, Japanese, and Korean, implementers must manage both horizontal and vertical writing modes, since the pagination model differs.

#### Horizontal writing mode

User settings to disable are: 

- `--USER__textAlign`;
- `--USER__bodyHyphens`;
- `--USER__paraIndent`;
- `--USER__wordSpacing`.

User settings to add are:

- `--USER__noRuby`.

Finally, `--USER__letterSpacing` should be treated as an exception. We are aware it can be useful in Japanese, but don’t know what the situation is as regards Chinese and Korean. **It’s up to implementers to decide whether it should be enabled or disabled for each of these languages.**

#### Vertical writing mode

This also impacts the Mongolian script.

User settings to disable are:

- `--USER__colCount`;
- `--USER__textAlign`;
- `--USER__bodyHyphens`;
- `--USER__paraIndent`;
- `--USER__wordSpacing`.

User settings to add are:

- `--USER__noRuby`.

Finally, `--USER__letterSpacing` should be treated as an exception. We are aware it can be useful in Japanese, but don’t know what the situation is as regards Chinese and Korean. **It’s up to implementers to decide whether it should be enabled or disabled for each of these languages.**