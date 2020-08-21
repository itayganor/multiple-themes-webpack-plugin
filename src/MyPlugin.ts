import {getNewLinkTag} from './utils';

const webpack = require('webpack');
const WebpackCSSThemesPlugin = require('webpack-css-themes-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExcludeAssetsPlugin = require('@ianwalter/exclude-assets-plugin');

const wow = require('./funcSync.js');


class MyPlugin {
    options: object;

    constructor(options) {
        this.options = options;
    }

    apply(compiler) {
        const {themes, pluginThemes, defaultThemeName} = wow(this.options);

        const damn = new WebpackCSSThemesPlugin({
            themes: pluginThemes,
        });
        damn.apply(compiler);

        const globals = new webpack.DefinePlugin({
            THEMES: JSON.stringify(themes),
            DEFAULT_THEME_NAME: JSON.stringify(defaultThemeName),
        });
        globals.apply(compiler);

        // append the default theme so there will not be a FOUC.
        compiler.options.plugins.forEach(plugin => {
            if (plugin instanceof HtmlWebpackPlugin) {
                plugin.options.extraHeadTags = getNewLinkTag(defaultThemeName, themes[defaultThemeName], true);
                plugin.options.excludeAssets = [/\.css$/];
            }
        });

        const exclude = new ExcludeAssetsPlugin();
        exclude.apply(compiler);
    }
}

export default MyPlugin;
