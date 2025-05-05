# Readium CSS

[![Readium Logo](https://readium.org/assets/logos/readium-logo.png)](https://readium.org)

A set of reference stylesheets for EPUB Reading Systems, starting with Readium 2.

Readium CSS provides styles for reflowable text: 

- paged and scrolled views;
- a “patch” for HTML5 Suggested Rendering specific to publications (e.g. extra styles for hyphenation, breaks, etc.);
- default styles for unstyled ebooks;
- reading modes (day, night, and sepia);
- themes;
- user settings;
- a set of baselines and recommendations for accessibility, overrides, and internationalization.

## License

BSD-3-Clause (http://opensource.org/licenses/BSD-3-Clause)

See [license.txt](https://github.com/readium/readium-css/blob/master/LICENSE).

## Scope of this project

The primary goal of Readium CSS is to provide Reading System implementers with reliable and modern styles for reflowable EPUB 2 and EPUB 3 files. In addition, it should provide good interoperability in the existing ecosystem, while not overriding authors’ styles unless strictly necessary.

Readium CSS stylesheets were not designed and should not be used for fixed-layout EPUB, nor other file formats like FB2, PRC, Mobi, TEI, etc. Works in progress like Web Publications or Portable Web Publications are also out of scope.

Some issues, which may be raised during development, will be documented so that they can serve as a reference for revisions of the EPUB specification, and even future specifications.

## Testing

An [iOS test app](https://github.com/readium/r2-testapp-swift) for the Swift implementation of Readium 2 is using Readium CSS and can be [downloaded on the App Store](https://itunes.apple.com/us/app/r2-reader/id1363963230?mt=8).

An [Android test app](https://github.com/readium/r2-testapp-kotlin) for the Kotlin implementation of Readium 2 is using Readium CSS. Stable builds are [available on Google Play](https://play.google.com/store/apps/details?id=org.readium.r2reader). To follow the development of this app, [join the beta channel](https://play.google.com/apps/testing/org.readium.r2reader).

The Readium Desktop app is using Readium CSS and [is available for Linux, MacOS and Windows](https://github.com/edrlab/readium-desktop/releases).

You can also use the [webpub manifest prototype](https://github.com/HadrienGardeur/webpub-manifest/tree/gh-pages/examples/paged-viewer) with the [RS-streamer-js](https://github.com/edrlab/r2-streamer-js) in a local development environment. Please note you’ll have to manually inject stylesheets and apply settings via the console, or design and code scripts if you want a GUI (user settings menu).

## Other known implementations

There is no external implementation of Readium CSS so far.

Consequently, if you are encountering rendering issues with Readium (iOS apps, Android apps, or the Readium Chrome App), please report them on the [github section dedicated to the proper Readium project](https://github.com/readium) (readium-js, readium-shared-js, readium-sdk, etc.).

## Development

Active development is pulled in branch `develop` first, and then made available in the main branch when sufficiently tested and deemed stable.

### Init

Building and testing are relying on npm packages and scripts. To initialize your clone/fork, first install dev dependencies:

```
npm install
```

In case you’re encountering an error with Puppeteer, make sure you’re using at least Node v.20.11.1 – it might work with an earlier version but only the latest LTS as of March 21, 2024 has been tested.

Then create reference bitmaps for visual regression testing:

```
npm run test:ref
```

### Build

To transpile all stylesheets using PostCSS:

```
npm run build
```

To test the updated styles and catch visual regression bugs:

```
npm run test
```

To update reference bitmaps after a bugfix:

```
npm run test:approve
```

## Docs

Documentation [can be accessed in docs](docs).

[You can alternatively download it as an EPUB file](https://github.com/readium/css/raw/master/docs/ReadiumCSS_docs.epub).
