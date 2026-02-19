# Using custom fonts with Readium CSS

[Implementers’ doc]

Now that we have seen libre and variable fonts, let's see how to use custom fonts with Readium CSS.

Readium CSS cannot provide `@font-face` rules, as this would require apps to embed fonts in every EPUB file they render, at a specific path relative to the current resource displayed. This does not scale,  would bloat file sizes, and would not resolve the issue of previewing these fonts in the app itself.

## Declaring fonts

Apps can declare custom fonts by injecting `@font-face` rules into the content’s `head` element. It is critical that these rules are injected in each content resource, as the browser needs to resolve the `font-family` values used in the Readium CSS stylesheet.

To declare a static font:

```css
@font-face {
  font-family: "MyCustomFont";
  src: url("https://example.org/path/to/font.woff2") format("woff2");
  font-weight: normal;
  font-style: normal;
}

@font-face {
  font-family: "MyCustomFont";
  src: url("https://example.org/path/to/font-italic.woff2") format("woff2");
  font-weight: normal;
  font-style: italic;
}

/* Bold and BoldItalic */
```

To declare a variable font:

```css
@font-face {
  font-family: "MyCustomVariableFont";
  src: url("https://example.org/path/to/variable-font.woff2") format("woff2");
  font-weight: 100 900;
  font-stretch: 50% 200%;
}
```

Your `src` url must be the exact path to the font file. The path type depends on how you serve the fonts:

- **Relative paths** (e.g., `url("../fonts/font.woff2")`) when fonts are bundled within the package you serve
- **Full absolute URLs** (e.g., `url("https://example.org/path/to/font.woff2")`) when fonts are hosted externally

This is important because the CSS may be used in different contexts such as iframes where incorrect path resolution will fail to load the font.

## Applying a custom font

Once you have declared a custom font, you can apply it to elements in your EPUB content by using the `--USER__fontFamily` property of Readium CSS.

```javascript
document.documentElement.style.setProperty("--USER__fontFamily", "MyCustomFont, sans-serif");
```

You can also leverage variable fonts by using their dedicated properties:

- `--USER__fontWeight`
- `--USER__fontWidth`

Then:

```javascript
document.documentElement.style.setProperty("--USER__fontWeight", "575");
document.documentElement.style.setProperty("--USER__fontWidth", "125%");
```

And for accessibility purposes, you can normalize text, which will remove all italics, font variants such as small capitals, subscript, and superscript formatting:

```javascript
document.documentElement.style.setProperty("--USER__a11yNormalize", "readium-a11y-on");
```
