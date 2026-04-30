# CSS Variables Reference

## Pagination

| Variable | Value |
| --- | --- |
| `--RS__colWidth` | `100vw` |
| `--RS__colCount` | `1` |
| `--RS__colGap` | `0` |
| `--RS__defaultLineLength` | `100%` |
| `--RS__pageGutter` | `0` |
| `--RS__viewportWidth` | `100%` |

## Colors

| Variable | Value |
| --- | --- |
| `--RS__backgroundColor` | `#FFFFFF` |
| `--RS__textColor` | `#121212` |
| `--RS__linkColor` | `#0000EE` |
| `--RS__visitedColor` | `#551A8B` |
| `--RS__selectionBackgroundColor` | `#b4d8fe` |
| `--RS__selectionTextColor` | `inherit` |

## Font Stacks

| Variable | Value |
| --- | --- |
| `--RS__oldStyleTf` | `'Iowan Old Style', Sitka, 'Sitka Text', Palatino, 'Book Antiqua', 'URW Palladio L', P052, serif` |
| `--RS__modernTf` | `Athelas, Constantia, Charter, 'Bitstream Charter', Cambria, 'Georgia Pro', Georgia, serif` |
| `--RS__sansTf` | `-ui-sans-serif, -apple-system, system-ui, BlinkMacSystemFont, 'Segoe UI Variable', 'Segoe UI', Inter, Roboto, 'Helvetica Neue', 'Arial Nova', 'Liberation Sans', Arial, sans-serif` |
| `--RS__humanistTf` | `Seravek, Calibri, 'Gill Sans Nova', Roboto, Ubuntu, 'DejaVu Sans', source-sans-pro, sans-serif` |
| `--RS__monospaceTf` | `ui-monospace, 'Andale Mono', 'Cascadia Code', 'Source Code Pro', Menlo, Consolas, 'DejaVu Sans Mono', monospace` |
| `--RS__serif-ja` | `'Hiragino Mincho ProN', 'Hiragino Mincho Pro', 'YuMincho', 'BIZ UDPMincho', 'Yu Mincho', 'ＭＳ Ｐ明朝', 'MS PMincho', serif` |
| `--RS__sans-serif-ja` | `'Hiragino Sans', 'Hiragino Kaku Gothic ProN', 'Hiragino Kaku Gothic Pro', 'ヒラギノ角ゴ W3', 'YuGothic', 'Yu Gothic Medium', 'BIZ UDPGothic', 'Yu Gothic', 'ＭＳ Ｐゴシック', 'MS PGothic', sans-serif` |
| `--RS__serif-ja-v` | `'Hiragino Mincho ProN', 'Hiragino Mincho Pro', 'YuMincho', 'BIZ UDMincho', 'Yu Mincho', 'ＭＳ明朝', 'MS Mincho', serif` |
| `--RS__sans-serif-ja-v` | `'Hiragino Sans', 'Hiragino Kaku Gothic ProN', 'Hiragino Kaku Gothic Pro', 'ヒラギノ角ゴ W3', 'YuGothic', 'Yu Gothic Medium', 'BIZ UDGothic', 'Yu Gothic', 'ＭＳゴシック', 'MS Gothic', sans-serif` |

## i18n

Different scripts require different amounts of line height. These compensation factors allow a Reading System to adjust a line-height value when the publication's language differs from its own, so that the result feels consistent across scripts rather than too tight or too loose.

```
adjustedLineHeight = lineHeight * (publicationCompensation / appCompensation)
```

| App language | Publication language | Effect |
| --- | --- | --- |
| Latin (`1.0`) | CJK (`1.167`) | line-height increases |
| CJK (`1.167`) | Latin (`1.0`) | line-height decreases |
| CJK (`1.167`) | CJK (`1.167`) | no change |
| Latin (`1.0`) | Latin (`1.0`) | no change |

To resolve a compensation factor for a BCP-47 language tag:

1. Match the full tag including region or script subtag (e.g. `zh-Hant`, `zh-HK`).
2. If no match, match on the primary language code alone (e.g. `zh`, `ja`).
3. If still no match, use `default` (`1`).

| Language | Base Font Family | Line Height Compensation |
| --- | --- | --- |
| `default` | `var(--RS__oldStyleTf)` | `1` |
| `am` | `Kefa, Nyala, Roboto, Noto, 'Noto Sans Ethiopic', serif` | `1.167` |
| `ar` | `'Geeza Pro', 'Arabic Typesetting', Roboto, Noto, 'Noto Naskh Arabic', 'Times New Roman', serif` | — |
| `bn` | `'Kohinoor Bangla', 'Bangla Sangam MN', Vrinda, Roboto, Noto, 'Noto Sans Bengali', sans-serif` | `1.067` |
| `bo` | `Kailasa, 'Microsoft Himalaya', Roboto, Noto, 'Noto Sans Tibetan', sans-serif` | — |
| `chr` | `'Plantagenet Cherokee', Roboto, Noto, 'Noto Sans Cherokee'` | `1.167` |
| `fa` | `'Geeza Pro', 'Arabic Typesetting', Roboto, Noto, 'Noto Naskh Arabic', 'Times New Roman', serif` | — |
| `gu` | `'Gujarati Sangam MN', 'Nirmala UI', Shruti, Roboto, Noto, 'Noto Sans Gujarati', sans-serif` | `1.167` |
| `he` | `'New Peninim MT', 'Arial Hebrew', Gisha, 'Times New Roman', Roboto, Noto, 'Noto Sans Hebrew' sans-serif` | `1.1` |
| `hi` | `'Kohinoor Devanagari', 'Devanagari Sangam MN', Kokila, 'Nirmala UI', Roboto, Noto, 'Noto Sans Devanagari', sans-serif` | `1.1` |
| `hy` | `Mshtakan, Sylfaen, Roboto, Noto, 'Noto Serif Armenian', serif` | — |
| `iu` | `'Euphemia UCAS', Euphemia, Roboto, Noto, 'Noto Sans Canadian Aboriginal', sans-serif` | — |
| `ja` | `YuGothic, 'Hiragino Maru Gothic ProN', 'Hiragino Sans', 'Yu Gothic UI', 'Meiryo UI', 'MS Gothic', Roboto, Noto, 'Noto Sans CJK JP', sans-serif` | `1.167` |
| `km` | `'Khmer Sangam MN', 'Leelawadee UI', 'Khmer UI', Roboto, Noto, 'Noto Sans Khmer', sans-serif` | `1.067` |
| `kn` | `'Kannada Sangam MN', 'Nirmala UI', Tunga, Roboto, Noto, 'Noto Sans Kannada', sans-serif` | `1.1` |
| `ko` | `'Nanum Gothic', 'Apple SD Gothic Neo', 'Malgun Gothic', Roboto, Noto, 'Noto Sans CJK KR', sans-serif` | `1.167` |
| `lo` | `'Lao Sangam MN', 'Leelawadee UI', 'Lao UI', Roboto, Noto, 'Noto Sans Lao', sans-serif` | — |
| `ml` | `'Malayalam Sangam MN', 'Nirmala UI', Kartika, Roboto, Noto, 'Noto Sans Malayalam', sans-serif` | `1.067` |
| `or` | `'Oriya Sangam MN', 'Nirmala UI', Kalinga, Roboto, Noto, 'Noto Sans Oriya', sans-serif` | `1.167` |
| `pa` | `'Gurmukhi MN', 'Nirmala UI', Kartika, Roboto, Noto, 'Noto Sans Gurmukhi', sans-serif` | `1.1` |
| `si` | `'Sinhala Sangam MN', 'Nirmala UI', 'Iskoola Pota', Roboto, Noto, 'Noto Sans Sinhala', sans-serif` | `1.167` |
| `ta` | `'Tamil Sangam MN', 'Nirmala UI', Latha, Roboto, Noto, 'Noto Sans Tamil', sans-serif` | `1.067` |
| `te` | `'Kohinoor Telugu', 'Telugu Sangam MN', 'Nirmala UI', Gautami, Roboto, Noto, 'Noto Sans Telugu', sans-serif` | — |
| `th` | `Thonburi, 'Leelawadee UI', 'Cordia New', Roboto, Noto, 'Noto Sans Thai', sans-serif` | `1.067` |
| `zh` | `'方体', 'PingFang SC', '黑体', 'Heiti SC', 'Microsoft JhengHei UI', 'Microsoft JhengHei', Roboto, Noto, 'Noto Sans CJK SC', sans-serif` | `1.167` |
| `zh-Hant` | `'方體', 'PingFang TC', '黑體', 'Heiti TC', 'Microsoft JhengHei UI', 'Microsoft JhengHei', Roboto, Noto, 'Noto Sans CJK TC', sans-serif` | `1.167` |
| `zh-TW` | `'方體', 'PingFang TC', '黑體', 'Heiti TC', 'Microsoft JhengHei UI', 'Microsoft JhengHei', Roboto, Noto, 'Noto Sans CJK TC', sans-serif` | `1.167` |
| `zh-HK` | `'方體', 'PingFang HK', '方體', 'PingFang TC', '黑體', 'Heiti TC', 'Microsoft JhengHei UI', 'Microsoft JhengHei', Roboto, Noto, 'Noto Sans CJK TC', sans-serif` | `1.167` |

## Experiments

### experimentalHeaderFiltering

Attempts to filter out paragraphs that are implicitly headings or part of headers

**Value:** `readium-experimentalHeaderFiltering-on`

### experimentalZoom

Attemps to filter out elements that are sized using viewport units and should not be scaled directly e.g. tables, images, iframes, etc.

**Value:** `readium-experimentalZoom-on`
