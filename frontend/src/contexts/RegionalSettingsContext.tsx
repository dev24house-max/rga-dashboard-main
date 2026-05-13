import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface RegionalSettings {
    language: string;
    timezone: string;
    currency: string;
    dateFormat: string;
    setLanguage: (value: string) => void;
    setTimezone: (value: string) => void;
    setCurrency: (value: string) => void;
    setDateFormat: (value: string) => void;
}

const defaultSettings = {
    language: 'th',
    timezone: 'asia-bangkok',
    currency: 'thb',
    dateFormat: 'dmy',
    setLanguage: () => { },
    setTimezone: () => { },
    setCurrency: () => { },
    setDateFormat: () => { },
};

const RegionalSettingsContext = createContext<RegionalSettings>(defaultSettings);

export const useRegionalSettings = () => useContext(RegionalSettingsContext);

export const RegionalSettingsProvider = ({ children }: { children: ReactNode }) => {
    const [language, setLanguage] = useState('th');
    const [timezone, setTimezone] = useState('asia-bangkok');
    const [currency, setCurrency] = useState('thb');
    const [dateFormat, setDateFormat] = useState('dmy');

    useEffect(() => {
        const saved = localStorage.getItem('dashboardSettings');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                setLanguage(parsed.language ?? 'th');
                setTimezone(parsed.timezone ?? 'asia-bangkok');
                setCurrency(parsed.currency ?? 'thb');
                setDateFormat(parsed.dateFormat ?? 'dmy');
            } catch {
                // ignore invalid saved settings
            }
        }
    }, []);

    useEffect(() => {
        localStorage.setItem(
            'dashboardSettings',
            JSON.stringify({
                language,
                timezone,
                currency,
                dateFormat,
            })
        );
    }, [language, timezone, currency, dateFormat]);

    return (
        <RegionalSettingsContext.Provider
            value={{
                language,
                timezone,
                currency,
                dateFormat,
                setLanguage,
                setTimezone,
                setCurrency,
                setDateFormat,
            }}
        >
            {children}
        </RegionalSettingsContext.Provider>
    );
};
