# Readium CSS

[![Readium Logo](https://readium.org/assets/logos/readium-logo.png)](https://readium.org)

A set of reference stylesheets for EPUB Reading Systems.

Readium CSS provides styles for reflowable text: 

- paged and scrolled views;
- a “patch” for HTML5 Suggested Rendering specific to publications (e.g. extra styles for hyphenation, breaks, etc.);
- default styles for unstyled ebooks;
- theming;
- user settings;
- a set of baselines and recommendations for accessibility, overrides, and internationalization.

## License

BSD-3-Clause (http://opensource.org/licenses/BSD-3-Clause)

See [license.txt](https://github.com/readium/css/blob/master/LICENSE).

## Scope of this project

The primary goal of Readium CSS is to provide Reading System implementers with reliable and modern styles for reflowable EPUB 2 and EPUB 3 files. In addition, it should provide good interoperability in the existing ecosystem, while not overriding authors’ styles unless strictly necessary.

Readium CSS stylesheets were not designed and should not be used for fixed-layout EPUB, nor other file formats like FB2, PRC, Mobi, TEI, etc.

Some issues, which may be raised during development, will be documented so that they can serve as a reference for revisions of the EPUB specification, and even future specifications.

## Implementations

Readium CSS is implemented in the [Readium Mobile](https://github.com/readium/mobile) and [Readium Web](https://github.com/readium/web) projects.

You will find it in:

- [ts-toolkit](https://github.com/readium/ts-toolkit)
- [swift-toolkit](https://github.com/readium/swift-toolkit)
- [kotlin-toolkit](https://github.com/readium/kotlin-toolkit)

External use include:

- [Thorium Desktop](https://github.com/edrlab/thorium-reader)
- [Thorium Web](https://github.com/edrlab/thorium-web)
- [Zotero](https://github.com/zotero/reader)
- [Vital Source](https://www.vitalsource.com/)

## Development

Active development is pulled in branch `develop`.

### Init

Building and testing are relying on npm packages and scripts. To initialize your clone/fork, first install dev dependencies:

```
npm install
```

Then install the Playwright browser binary and generate reference screenshots for visual regression testing:

```
npx playwright install chromium
npm run test:update
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

To update reference screenshots after an intentional change:

```
npm run test:update
```

## Docs

Documentation [can be accessed in docs](docs).

[You can alternatively download it as an EPUB file](https://github.com/readium/css/raw/master/docs/ReadiumCSS_docs.epub).
