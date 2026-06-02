import { useMemo } from 'react';
import { useRegionalSettings } from '@/contexts/RegionalSettingsContext';
import { resources, TranslationNamespace } from './resources';

type TranslationParams = Record<string, string | number>;
type TranslationRecord = Record<string, unknown>;

function getByPath(source: unknown, path: string): unknown {
    return path.split('.').reduce<unknown>((current, segment) => {
        if (!current || typeof current !== 'object') return undefined;
        return (current as TranslationRecord)[segment];
    }, source);
}

function interpolate(value: string, params?: TranslationParams) {
    if (!params) return value;

    return value.replace(/\{(\w+)\}/g, (match, key) => {
        const replacement = params[key];
        return replacement === undefined ? match : String(replacement);
    });
}

export function useTranslation(namespace: TranslationNamespace) {
    const { language } = useRegionalSettings();
    const fallback = resources.en[namespace];
    const current =
        resources[language as keyof typeof resources]?.[namespace] ?? fallback;

    return useMemo(
        () => ({
            language,
            t: (path: string, params?: TranslationParams) => {
                const raw =
                    getByPath(current, path) ?? getByPath(fallback, path);
                return typeof raw === 'string'
                    ? interpolate(raw, params)
                    : path;
            },
        }),
        [current, fallback, language]
    );
}
