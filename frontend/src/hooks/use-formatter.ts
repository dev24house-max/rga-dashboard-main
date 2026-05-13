import { useRegionalSettings } from '@/contexts/RegionalSettingsContext';
import { useState, useEffect } from 'react';

// Map settings to Intl locales and date-fns formats
const LANGUAGE_LOCALE_MAP: Record<string, string> = {
    'th': 'th-TH',
    'en': 'en-US',
};

const CURRENCY_CODE_MAP: Record<string, string> = {
    'thb': 'THB',
    'usd': 'USD',
};

const DATE_FORMAT_MAP: Record<string, string> = {
    'dmy': 'dd/MM/yyyy',
    'mdy': 'MM/dd/yyyy',
    'ymd': 'yyyy-MM-dd',
};

const TIMEZONE_MAP: Record<string, string> = {
    'asia-bangkok': 'Asia/Bangkok',
    'utc': 'UTC',
};

// Exchange rates (THB to USD)
const EXCHANGE_RATES: Record<string, number> = {
    'THB': 1,
    'USD': 0.028, // 1 THB = 0.028 USD (approx 35.7 THB = 1 USD)
};

// Optional: Fetch real-time exchange rates
async function fetchExchangeRate(currency: string): Promise<number> {
    if (currency === 'THB') return 1;

    try {
        const response = await fetch('https://api.exchangerate-api.com/v4/latest/THB');
        const data = await response.json();
        return data.rates[currency.toUpperCase()] || EXCHANGE_RATES[currency] || 1;
    } catch {
        return EXCHANGE_RATES[currency] || 1;
    }
}

export function useFormatter() {
    const { language, timezone, currency, dateFormat } = useRegionalSettings();
    const [exchangeRate, setExchangeRate] = useState<number>(EXCHANGE_RATES[currency] || 1);

    const locale = LANGUAGE_LOCALE_MAP[language] || 'th-TH';
    const currencyCode = CURRENCY_CODE_MAP[currency] || 'THB';
    const dateFormatStr = DATE_FORMAT_MAP[dateFormat] || 'dd/MM/yyyy';
    const tz = TIMEZONE_MAP[timezone] || 'Asia/Bangkok';

    // Update exchange rate when currency changes
    useEffect(() => {
        const loadRate = async () => {
            const rate = await fetchExchangeRate(currency);
            setExchangeRate(rate);
        };

        setExchangeRate(EXCHANGE_RATES[currency] || 1);
        loadRate();
    }, [currency]);

    // Convert amount from THB to target currency
    const convertAmount = (amount: number): number => {
        return amount * exchangeRate;
    };

    const formatCurrency = (amount: number, options?: Intl.NumberFormatOptions): string => {
        const convertedAmount = convertAmount(amount);

        // Default: show 2 decimal places for USD, 0 for THB (can be overridden)
        const defaultFractionDigits = currencyCode === 'USD' ? 2 : 0;

        const formatOptions: Intl.NumberFormatOptions = {
            style: 'currency',
            currency: currencyCode,
            minimumFractionDigits: defaultFractionDigits,
            maximumFractionDigits: defaultFractionDigits,
            ...options,
        };

        // Ensure min/max digits remain valid when options override only one side.
        if (
            typeof formatOptions.maximumFractionDigits === 'number' &&
            typeof formatOptions.minimumFractionDigits === 'number' &&
            formatOptions.minimumFractionDigits > formatOptions.maximumFractionDigits
        ) {
            formatOptions.minimumFractionDigits = formatOptions.maximumFractionDigits;
        }

        return new Intl.NumberFormat(locale, formatOptions).format(convertedAmount);
    };

    const formatNumber = (num: number): string => {
        return new Intl.NumberFormat(locale).format(num);
    };

    const formatDate = (date: Date | string, formatStr?: string): string => {
        const d = typeof date === 'string' ? new Date(date) : date;
        const fmt = formatStr || dateFormatStr;

        try {
            const formatter = new Intl.DateTimeFormat(locale, {
                timeZone: tz,
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
            });

            const parts = formatter.formatToParts(d);
            const year = parts.find(p => p.type === 'year')?.value || '';
            const month = parts.find(p => p.type === 'month')?.value || '';
            const day = parts.find(p => p.type === 'day')?.value || '';

            switch (fmt) {
                case 'dd/MM/yyyy':
                    return `${day}/${month}/${year}`;
                case 'MM/dd/yyyy':
                    return `${month}/${day}/${year}`;
                case 'yyyy-MM-dd':
                    return `${year}-${month}-${day}`;
                default:
                    return `${day}/${month}/${year}`;
            }
        } catch (e) {
            const year = d.getFullYear();
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const day = String(d.getDate()).padStart(2, '0');

            switch (fmt) {
                case 'dd/MM/yyyy':
                    return `${day}/${month}/${year}`;
                case 'MM/dd/yyyy':
                    return `${month}/${day}/${year}`;
                case 'yyyy-MM-dd':
                    return `${year}-${month}-${day}`;
                default:
                    return `${day}/${month}/${year}`;
            }
        }
    };

    const formatCurrencyShort = (amount: number): string => {
        const safe = convertAmount(amount || 0);
        const symbol = currencyCode === 'THB' ? '฿' : '$';

        const decimalPlaces = currencyCode === 'USD' ? 2 : 0;
        const toFixed = (num: number) => decimalPlaces > 0 ? num.toFixed(decimalPlaces) : Math.round(num).toString();

        if (safe >= 1000000) return `${symbol}${(safe / 1000000).toFixed(1)}M`;
        if (safe >= 1000) return `${symbol}${(safe / 1000).toFixed(0)}K`;
        return `${symbol}${toFixed(safe)}`;
    };

    return {
        locale,
        currencyCode,
        dateFormatStr,
        exchangeRate,
        formatCurrency,
        formatNumber,
        formatDate,
        formatCurrencyShort,
        convertAmount,
    };
}
