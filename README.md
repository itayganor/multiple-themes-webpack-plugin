# multiple-themes-webpack-plugin

[![npm version](https://img.shields.io/npm/v/multiple-themes-webpack-plugin)](https://www.npmjs.com/package/multiple-themes-webpack-plugin)

A webpack plugin to generate multiple themes for your app.

Wraps [webpack-css-themes-plugin](https://github.com/gem-mine/webpack-css-themes-plugin).

# Installation

Install from NPM:
```cmd
npm install -D multiple-themes-webpack-plugin
```

Also install `html-webpack-plugin` if you don't have it already:

```cmd
npm install -D html-webpack-plugin
```

# Usage

## Setting up the plugin

In your `webpack.config.js`:
```ts
import MultipleThemesPlugin from 'multiple-themes-webpack-plugin/dist/MultipleThemesPlugin';
```

Add it to your plugins list:
```js
{
    plugins: {
        // ... your other plugins,
        new MultipleThemesPlugin({
            themes: {
                // for each theme, assign a name and a path to its variables
                dark: path.resolve(__dirname, './src/themes/theme-dark.less'),
                light: path.resolve(__dirname, './src/themes/theme-light.less'),
            },
        }),
        // Don't forget to include the html-webpack-plugin plugin
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, './index.html'),
        }),
    }
}
```

## Switching themes at runtime

import the switch function anywhere in your project:
```js
import {switchTheme} from 'multiple-themes-webpack-plugin';
```

Call that function with the new theme's name as an argument:
```
switchTheme('dark');
```

***Developer recommendation:** If you use Typescript, It is recommended to use enums for theme names - for convenience, autocomplete options, and to make sure you won't have typos.*

# Gotcha's

### Default theme
To have a default theme preloaded directly in the HTML file (mainly to prevent a [FOUC](https://en.wikipedia.org/wiki/Flash_of_unstyled_content)),
Add this before your closing `</head>` tag:
```html
    <%= htmlWebpackPlugin.options.extraHeadTags %>
```

And in the plugin options:
```js
new MultipleThemesPlugin({
    themes: {
        dark: path.resolve(__dirname, './src/themes/theme-dark.less'),
        light: path.resolve(__dirname, './src/themes/theme-light.less'),
    },
    defaultTheme: 'dark',
}),
```

### CSS Imports inside `.less` files

If you try to `@import` a `.css` file inside a `.less` file, You'll get the following error:

```
Error: Didn't get a result from child compiler
```

To avoid this, tell the compiler to treat the file as a Less file using the [Import Options](http://lesscss.org/features/#import-atrules-feature-import-options) feature:

```less
@import (less) './assets/fonts/Lato/Lato.css';
```

*See [webpack-css-themes-plugin#4](https://github.com/gem-mine/webpack-css-themes-plugin/issues/4) for more information.*

### Exclude Assets Plugin
Default generated CSS Assets are excluded from the `html` file, since this plugin appends its own styles automatically. If you ever wonder why you don't see your compiled themes without supplying a default theme, this is the reason.
