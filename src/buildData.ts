import path from 'path';

import {Options, PluginThemes, RuntimeThemes, SourceThemes} from './types';



const DEFAULT_OPTIONS: Options = {
    themes: {},
    defaultTheme: null,
    cssPathInPublicPath: 'css',
    themePrefix: 'theme',
};

function main(inputOptions: Partial<Options>) {
    const options: Options = {
        ...DEFAULT_OPTIONS,
        ...inputOptions,
    };
    const {themes} = options;
    if (Object.keys(themes).length === 0) {
        throw new Error('you have to have at least one theme in your app.');
    }

    const pluginThemes = buildPluginThemesArray(themes, options);
    const runtimeThemes = buildRuntimeThemes(Object.keys(themes), options);

    return {themes: runtimeThemes, pluginThemes};
}

export default main;


/**
 * Builds the theme array for WebpackCSSThemesPlugin.
 */
function buildPluginThemesArray(themes: SourceThemes, options: Options): PluginThemes {
    return Object.keys(themes).map(themeName => {
        return {
            name: themeName,
            entryPath: themes[themeName],
            distFilename: path.join(options.cssPathInPublicPath, `${options.themePrefix}.css`),
        };
    });
}

/**
 * Builds the themes object:
 * {
 *     'demo-dark': './css/theme-demo-dark.css',
 *     'demo-light': './css/theme-demo-light.css',
 * }
 */
function buildRuntimeThemes(themeNames: (keyof SourceThemes)[], options: Options): RuntimeThemes {
    return themeNames.reduce((result, themeName) => {
        result[themeName] = path.join(options.cssPathInPublicPath, `${options.themePrefix}-${themeName}.css`);
        return result;
    }, {});
}

/**
 * Utilities
 */
