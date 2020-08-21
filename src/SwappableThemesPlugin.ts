import webpack, {Plugin} from 'webpack';
import WebpackCSSThemesPlugin from 'webpack-css-themes-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import ExcludeAssetsPlugin from '@ianwalter/exclude-assets-plugin';

import {getNewLinkTag} from './utils';
import buildThemesData from './buildData';


type HtmlWebpackPluginWithCustomFields = HtmlWebpackPlugin & {
    options: {
        extraHeadTags: string;
        excludeAssets: RegExp[];
    };
};


class SwappableThemesPlugin extends Plugin {
    options: object;

    constructor(options) {
        super();
        this.options = options;
    }

    apply(compiler) {
        const {themes, pluginThemes, defaultThemeName} = buildThemesData(this.options);

        const damn: Plugin = new WebpackCSSThemesPlugin({
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
                const thePlugin = plugin as HtmlWebpackPluginWithCustomFields;
                thePlugin.options.extraHeadTags = getNewLinkTag(defaultThemeName, themes[defaultThemeName], true);
                thePlugin.options.excludeAssets = [/\.css$/];
            }
        });

        const exclude: Plugin = new ExcludeAssetsPlugin();
        exclude.apply(compiler);
    }
}

export default SwappableThemesPlugin;
