// =============================================================================
// Settings Page - User Preferences and Alert Configuration
// =============================================================================

import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Settings2, Bell } from 'lucide-react';
import { AlertRulesTab } from '@/features/alerts/components/AlertRulesTab';
import { useTheme } from '@/contexts/ThemeContext';
import { useRegionalSettings } from '@/contexts/RegionalSettingsContext';
import { useTranslation } from '@/i18n/use-translation';

// =============================================================================
// General Settings Tab Content
// =============================================================================

interface GeneralSettingsTabProps {
    theme: 'light' | 'dark';
    toggleTheme?: () => void;
    switchable: boolean;
    language: string;
    timezone: string;
    currency: string;
    dateFormat: string;
    inAppNotifications: boolean;
    emailNotifications: boolean;
    lineNotifications: boolean;
    onLanguageChange: (value: string) => void;
    onTimezoneChange: (value: string) => void;
    onCurrencyChange: (value: string) => void;
    onDateFormatChange: (value: string) => void;
    onInAppNotificationsChange: (checked: boolean) => void;
    onEmailNotificationsChange: (checked: boolean) => void;
    onLineNotificationsChange: (checked: boolean) => void;
}

function GeneralSettingsTab({
    theme,
    toggleTheme,
    switchable,
    language,
    timezone,
    currency,
    dateFormat,
    inAppNotifications,
    emailNotifications,
    lineNotifications,
    onLanguageChange,
    onTimezoneChange,
    onCurrencyChange,
    onDateFormatChange,
    onInAppNotificationsChange,
    onEmailNotificationsChange,
    onLineNotificationsChange,
}: GeneralSettingsTabProps) {
    const { t } = useTranslation('settings');

    return (
        <div className="space-y-6">
            {/* Appearance Settings */}
            <Card data-tutorial="settings-appearance">
                <CardHeader>
                    <CardTitle className="dark:text-zinc-100">
                        {t('general.appearance.title')}
                    </CardTitle>
                    <CardDescription className="dark:text-zinc-400">
                        {t('general.appearance.description')}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label className="dark:text-zinc-100">
                                {t('general.appearance.darkMode.label')}
                            </Label>
                            <p className="text-sm text-muted-foreground dark:text-zinc-500">
                                {t('general.appearance.darkMode.description')}
                            </p>
                        </div>
                        <Switch
                            checked={theme === 'dark'}
                            onCheckedChange={toggleTheme}
                            disabled={!switchable}
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label className="dark:text-zinc-100">
                                {t('general.appearance.compactView.label')}
                            </Label>
                            <p className="text-sm text-muted-foreground dark:text-zinc-500">
                                {t(
                                    'general.appearance.compactView.description'
                                )}
                            </p>
                        </div>
                        <Switch
                            checked={inAppNotifications}
                            onCheckedChange={onInAppNotificationsChange}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Regional Settings */}
            <Card data-tutorial="settings-regional">
                <CardHeader>
                    <CardTitle className="dark:text-zinc-100">
                        {t('general.regional.title')}
                    </CardTitle>
                    <CardDescription className="dark:text-zinc-400">
                        {t('general.regional.description')}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label className="dark:text-zinc-100">
                                {t('general.regional.language')}
                            </Label>
                            <Select
                                value={language}
                                onValueChange={onLanguageChange}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="th">
                                        {t('general.regional.languages.th')}
                                    </SelectItem>
                                    <SelectItem value="en">
                                        {t('general.regional.languages.en')}
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label className="dark:text-zinc-100">
                                {t('general.regional.timezone')}
                            </Label>
                            <Select
                                value={timezone}
                                onValueChange={onTimezoneChange}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="asia-bangkok">
                                        {t(
                                            'general.regional.timezones.asiaBangkok'
                                        )}
                                    </SelectItem>
                                    <SelectItem value="utc">
                                        {t('general.regional.timezones.utc')}
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label className="dark:text-zinc-100">
                                {t('general.regional.currency')}
                            </Label>
                            <Select
                                value={currency}
                                onValueChange={onCurrencyChange}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="thb">
                                        {t('general.regional.currencies.thb')}
                                    </SelectItem>
                                    <SelectItem value="usd">
                                        {t('general.regional.currencies.usd')}
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label className="dark:text-zinc-100">
                                {t('general.regional.dateFormat')}
                            </Label>
                            <Select
                                value={dateFormat}
                                onValueChange={onDateFormatChange}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="dmy">
                                        {t('general.regional.dateFormats.dmy')}
                                    </SelectItem>
                                    <SelectItem value="mdy">
                                        {t('general.regional.dateFormats.mdy')}
                                    </SelectItem>
                                    <SelectItem value="ymd">
                                        {t('general.regional.dateFormats.ymd')}
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Notification Preferences */}
            <Card data-tutorial="settings-notifications">
                <CardHeader>
                    <CardTitle className="dark:text-zinc-100">
                        {t('general.notifications.title')}
                    </CardTitle>
                    <CardDescription className="dark:text-zinc-400">
                        {t('general.notifications.description')}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label className="dark:text-zinc-100">
                                {t('general.notifications.inApp.label')}
                            </Label>
                            <p className="text-sm text-muted-foreground dark:text-zinc-500">
                                {t('general.notifications.inApp.description')}
                            </p>
                        </div>
                        <Switch
                            checked={inAppNotifications}
                            onCheckedChange={onInAppNotificationsChange}
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label className="dark:text-zinc-100">
                                {t('general.notifications.email.label')}
                            </Label>
                            <p className="text-sm text-muted-foreground dark:text-zinc-500">
                                {t('general.notifications.email.description')}
                            </p>
                        </div>
                        <Switch
                            checked={emailNotifications}
                            onCheckedChange={onEmailNotificationsChange}
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label className="dark:text-zinc-100">
                                {t('general.notifications.line.label')}
                            </Label>
                            <p className="text-sm text-muted-foreground dark:text-zinc-500">
                                {t('general.notifications.line.description')}
                            </p>
                        </div>
                        <Switch
                            checked={lineNotifications}
                            onCheckedChange={onLineNotificationsChange}
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

// =============================================================================
// Main Settings Page
// =============================================================================

export default function Settings() {
    const { t } = useTranslation('settings');
    const { theme, toggleTheme, switchable } = useTheme();
    const {
        language,
        timezone,
        currency,
        dateFormat,
        setLanguage,
        setTimezone,
        setCurrency,
        setDateFormat,
    } = useRegionalSettings();
    const [inAppNotifications, setInAppNotifications] = React.useState(true);
    const [emailNotifications, setEmailNotifications] = React.useState(false);
    const [lineNotifications, setLineNotifications] = React.useState(false);

    return (
        <ProtectedRoute>
            <DashboardLayout>
                <div className="space-y-6">
                    {/* Page Header */}
                    <div
                        data-tutorial="settings-header"
                        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-zinc-100">
                                {t('page.title')}
                            </h1>
                            <p className="text-sm text-slate-500 dark:text-zinc-500 mt-1">
                                {t('page.subtitle')}
                            </p>
                        </div>
                    </div>

                    {/* Settings Tabs */}
                    <Tabs defaultValue="general" className="space-y-6">
                        <TabsList
                            data-tutorial="settings-tabs"
                            className="grid w-full max-w-md grid-cols-2"
                        >
                            <TabsTrigger
                                value="general"
                                className="flex items-center gap-2"
                            >
                                <Settings2 className="h-4 w-4" />
                                {t('page.tabs.general')}
                            </TabsTrigger>
                            <TabsTrigger
                                data-tutorial="settings-alerts-tab"
                                value="alerts"
                                className="flex items-center gap-2"
                            >
                                <Bell className="h-4 w-4" />
                                {t('page.tabs.alertRules')}
                            </TabsTrigger>
                        </TabsList>

                        {/* General Settings Tab */}
                        <TabsContent value="general">
                            <GeneralSettingsTab
                                theme={theme}
                                toggleTheme={toggleTheme}
                                switchable={switchable}
                                language={language}
                                timezone={timezone}
                                currency={currency}
                                dateFormat={dateFormat}
                                inAppNotifications={inAppNotifications}
                                emailNotifications={emailNotifications}
                                lineNotifications={lineNotifications}
                                onLanguageChange={setLanguage}
                                onTimezoneChange={setTimezone}
                                onCurrencyChange={setCurrency}
                                onDateFormatChange={setDateFormat}
                                onInAppNotificationsChange={
                                    setInAppNotifications
                                }
                                onEmailNotificationsChange={
                                    setEmailNotifications
                                }
                                onLineNotificationsChange={setLineNotifications}
                            />
                        </TabsContent>

                        {/* Alert Rules Tab */}
                        <TabsContent value="alerts">
                            <AlertRulesTab />
                        </TabsContent>
                    </Tabs>
                </div>
            </DashboardLayout>
        </ProtectedRoute>
    );
}
