const _fs = require('fs');
const path = require('path');
const fs = _fs.promises;


const DEFAULT_OPTIONS = {
    themesDirectory: './src/theme/themes',
    cssPathInPublicPath: 'css',
    themePrefix: 'theme',
    palette: './src/theme/palette.less',
};

async function main(options) {
    options = {
        ...DEFAULT_OPTIONS,
        ...options,
    };
    const themes = await getThemesObject(options);
    const pluginThemes = await buildPluginThemesArray(themes, options);
    const runtimeThemes = buildRuntimeThemes(Object.keys(themes), options);
    const defaultThemeName = await findDefaultTheme(themes, options);

    return {themes: runtimeThemes, pluginThemes, defaultThemeName};
}

module.exports = main;


/**
 * Return an object that looks like:
 * {
 *     'demo-dark': './src/theme/themes/demo-dark.less',
 *     'demo-light': './src/theme/themes/demo-light.less',
 * }
 */
async function getThemesObject(options) {
    const themesDir = path.resolve(__dirname, options.themesDirectory);
    const themesFileNames = await getFilesInDirectory(themesDir);
    const themes = {};
    themesFileNames.forEach(themeFileName => {
        const themeName = path.parse(themeFileName).name;
        themes[themeName] = path.resolve(themesDir, themeFileName);
    });

    return themes;
}

/**
 * Builds the theme array for WebpackCSSThemesPlugin.
 */
async function buildPluginThemesArray(themes, options) {
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
function buildRuntimeThemes(themeNames, options) {
    return themeNames.reduce((result, themeName) => {
        result[themeName] = path.join(options.cssPathInPublicPath, `${options.themePrefix}-${themeName}.css`);
        return result;
    }, {});
}


async function findDefaultTheme(themes, options) {
    const fileContents = (await fs.readFile(path.resolve(__dirname, options.palette))).toString();
    const importRegex = new RegExp(/@import ['"]([^'"]+)['"];?/);
    const matches = importRegex.exec(fileContents);
    const importFound = matches === null ? null : matches[1];
    const pathTo = path.resolve(path.dirname(options.palette), importFound);
    let defaultThemeName = null;

    Object.keys(themes).some(themeName => {
        if (themes[themeName] === pathTo) {
            defaultThemeName = themeName;
            return true;
        }
    });

    return defaultThemeName;
}


/**
 * Utilities
 */


async function asyncFilter(array, predicate) {
    const results = await Promise.all(array.map(predicate));

    return array.filter((_, index) => results[index]);
}

async function getFilesInDirectory(dirPath) {
    const items = await fs.readdir(dirPath);
    return await asyncFilter(items, async item => {
        const itemPath = path.resolve(dirPath, item);
        const stats = await fs.stat(itemPath);
        return !stats.isDirectory();
    });
}
