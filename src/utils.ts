import {RuntimeThemes} from './types';

const THEME_KEY = 'theme';
const PLUGIN_KEY = 'pkey';
const PLUGIN_VALUE = 'swappable-themes';


declare const THEMES: RuntimeThemes;


export default function swapTheme(theme: string, onLoad?: (link: HTMLLinkElement) => void) {
    const themeUrl = (THEMES ?? {})[theme] ?? null;

    if (themeUrl === null) {
        console.error(`Could not switch to theme ${theme}. It was not found within the known themes.`, THEMES);
        return;
    }

    const head = document.getElementsByTagName('head')[0];
    const oldTheme = Array.from(head.getElementsByTagName('link'))
        .find(node => node.getAttribute(PLUGIN_KEY) === PLUGIN_VALUE);

    const link = getNewLinkTag(theme, themeUrl);
    head.appendChild(link);
    link.onload = () => {
        oldTheme && oldTheme.remove();
        onLoad && onLoad(link);
    };
    link.onerror = (e) => {
        console.error(e);
        link.remove();
    };
}

export function getNewLinkTag(theme, themeUrl, stringLink?: false): HTMLLinkElement;
export function getNewLinkTag(theme, themeUrl, stringLink: true): string;
export function getNewLinkTag(theme, themeUrl, stringLink = false): string | HTMLLinkElement {
    if (stringLink) {
        return `<link rel="stylesheet" href=${themeUrl} ${THEME_KEY}=${theme} ${PLUGIN_KEY}=${PLUGIN_VALUE}`;
    }

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = themeUrl;
    link.setAttribute(THEME_KEY, theme);
    link.setAttribute(PLUGIN_KEY, PLUGIN_VALUE);
    return link;
}
