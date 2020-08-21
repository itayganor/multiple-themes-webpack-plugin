export interface Options {
    themesDirectory: string;
    cssPathInPublicPath: string;
    themePrefix: string;
    palette: string;
}

export interface SourceThemes {
    [themeName: string]: string;
}

export type PluginThemes = {
    name: string;
    entryPath: string;
    distFilename: string;
}[];

export interface RuntimeThemes {
    [themeName: string]: string;
}
