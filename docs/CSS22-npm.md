# Install, test and build Readium CSS

[Implementers’ doc]

## Install and init references for regression tests

First, navigatate to the project’s folder in your terminal, 

```
cd path/to/readium-css
```

then type: 

```
npm install
```

This will install all dev dependencies needed and make npm scripts available to ease all processes you’ll need to run later.

Then, once the install is finished, type:

```
npx playwright install chromium
npm run test:update
```

This will install the Playwright browser binary and create reference screenshots for the CSS regression tests.

## Build

We are using PostCSS, a tool for transforming CSS with JavaScript. It comes with a vast amount of task-oriented plugins and allows authors to use modern specs which are not implemented yet.

- [PostCSS official website](http://postcss.org)
- [PostCSS tutorial](https://webdesign.tutsplus.com/tutorials/using-postcss-for-cross-browser-compatibility--cms-24567)
- [PostCSS plugins list](https://www.postcss.parts)

### PostCSS Dependencies

ReadiumCSS is relying on a PostCSS config to build `dist` stylesheets. If you `npm install` the repository, all those dependencies will be installed as well.

Here is the current list of dependencies: 

- stylelint ([link](https://stylelint.io/user-guide/postcss-plugin/));
- postcss-cli ([link](https://github.com/postcss/postcss-cli));
- postcss-import ([link](https://github.com/postcss/postcss-import));
- postcss-sorting ([link](https://github.com/hudochenkov/postcss-sorting));
- postcss-custom-media ([link](https://github.com/postcss/postcss-custom-media));
- postcss-custom-selectors ([link](https://github.com/postcss/postcss-custom-selectors));
- postcss-discard-comments ([link](https://github.com/ben-eb/postcss-discard-comments));
- postcss-css-variables ([link](https://github.com/MadLittleMods/postcss-css-variables)) [disabled];
- postcss-alter-property-value ([link](https://github.com/kunukn/postcss-alter-property-value)) [disabled].

### Build dist stylesheets

If you customize `ReadiumCSS-config.css`, you will have to rebuild stylesheets.

**Note:** the current build process is subpar – to say the least. Please feel free to improve it (gulp, grunt, etc.).

#### Available scripts

By default, the following scripts are available: 

- `build`, will build all stylesheets;
- `build:ltr`, will build default stylesheets (Left to Right scripts);
- `build:rtl`, will build stylesheets for Right to Left scripts;
- `build:cjk`, will build stylesheets for Chinese, Japanese, and Korean in horizontal writing mode; 
- `build:vertical`, will build stylesheets for Chinese, Japanese, Korean, and Mongolian in vertical writing mode.

Those scripts will overwrite the files in the `css/dist` folder, the stylesheets you’ll use in your app.

#### Usage

First navigate to the `readium-css` folder if you didn’t already, then…

```
npm run build
```

#### Building dist stylesheets for browsers which don’t support CSS variables

If you need to build stylesheets for IE11 or an early version of Edge (e.g. 14), then you can use most of ReadiumCSS, excepted user settings. You’ll consequently have to customize the `src`’s `ReadiumCSS-before.css`, `ReadiumCSS-default.css` and `ReadiumCSS-after.css` and remove the user settings submodules.

Then you must customize the selectors in `ReadiumCSS-config.js` and replace them with either CSS classes or custom attributes so that flags can work as expected.

Finally you will have to enable the `postcss-css-variables` and `postcss-alter-property-value` in the `postcss.config.js` file to be found at the `src` folder’s root.

First, add the following imports at the top of the file:

```
import postcssCssVariables from 'postcss-css-variables';
import postcssAlterPropertyValue from 'postcss-alter-property-value';
```

Then add the following to `plugins`:

```
postcssCssVariables({
  preserve: true
}),
postcssAlterPropertyValue({
  declarations: {
    "*": {
      task: "remove",
      whenValueEquals: "undefined"
    }
  }
})
```

This will:

1. interpolate CSS variables into a static representation, while preserving variables for other browsers (`"preserve": true`);
2. remove static representations which can’t be interpolated and are `undefined` (`remove` task).

We recommend managing user settings via JavaScript in this case, especially as you can test support for CSS variables, as described in the [CSS Variables primer](../docs/CSS07-variables.md).

### Useful PostCSS plugins

Here is a list of additionnal PostCSS plugins which might prove useful to implementers.

- Unprefix EPUB properties: [EPUB interceptor](https://github.com/JayPanoz/postcss-epub-interceptor)
- Adding vendor prefixes: [Autoprefixer](https://github.com/postcss/autoprefixer)

## Test

Once you have built `dist` stylesheets, you can run visual regression tests using [Playwright](https://playwright.dev).

It helps you check if you didn’t accidentally create a breaking change when customizing stylesheets, and make sure pagination and user settings work as expected.

### Config

The test configuration lives in `playwright.config.js` at the root of the project. By default, it runs all tests at a 1024×768 tablet viewport using Chromium. You can adjust the viewport or add browsers there.

If you want to run tests with WebKit (useful for iOS development), install the additional browser and update `browserName` in the config:

```
npx playwright install webkit
```

### Test files

If you customize flags in `ReadiumCSS-config.css`, you must modify HTML files in the `tests` folder; user settings are indeed set as inline styles on the `html` element and are using the default flags.

### Available scripts

By default, the following scripts are available:

- `test`, will build stylesheets then run visual regression tests;
- `test:update`, will create or update reference screenshots.

### Usage

First navigate to the `readium-css` folder if you didn’t already, then…

```
npm run test
```

The regression tests will run against the newly-built `dist` stylesheets and compare each page against its stored reference screenshot.

If a test is marked as failed, it doesn’t necessarily mean the user setting failed — it just means you made a change that impacts rendering. Open the Playwright HTML report to inspect the diff, and if you’re happy with the result, update the references:

```
npm run test:update
```

This will make the current screenshots the new reference for the next test run.