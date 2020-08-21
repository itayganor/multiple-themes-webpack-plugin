export interface Options {
    themes: SourceThemes;
    defaultTheme: keyof SourceThemes | null;
    cssPathInPublicPath: string;
    themePrefix: string;
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
