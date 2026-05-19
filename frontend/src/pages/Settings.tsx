// =============================================================================
// Settings Page - User Preferences and Alert Configuration
// =============================================================================

import { useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
import React from 'react';

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
    return (
        <div className="space-y-6">
            {/* Appearance Settings */}
            <Card data-tutorial="settings-appearance">
                <CardHeader>
                    <CardTitle className="dark:text-zinc-100">Appearance</CardTitle>
                    <CardDescription className="dark:text-zinc-400">
                        Customize how the dashboard looks and feels.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label className="dark:text-zinc-100">Dark Mode</Label>
                            <p className="text-sm text-muted-foreground dark:text-zinc-500">
                                Switch to dark theme for low-light environments.
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
                            <Label className="dark:text-zinc-100">Compact View</Label>
                            <p className="text-sm text-muted-foreground dark:text-zinc-500">
                                Use smaller spacing to fit more data on screen.
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
                    <CardTitle className="dark:text-zinc-100">Regional</CardTitle>
                    <CardDescription className="dark:text-zinc-400">
                        Configure language and regional preferences.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label className="dark:text-zinc-100">Language</Label>
                            <Select value={language} onValueChange={onLanguageChange}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="th">ไทย (Thai)</SelectItem>
                                    <SelectItem value="en">English</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label className="dark:text-zinc-100">Timezone</Label>
                            <Select value={timezone} onValueChange={onTimezoneChange}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="asia-bangkok">Asia/Bangkok (UTC+7)</SelectItem>
                                    <SelectItem value="utc">UTC</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label className="dark:text-zinc-100">Currency</Label>
                            <Select value={currency} onValueChange={onCurrencyChange}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="thb">THB (฿)</SelectItem>
                                    <SelectItem value="usd">USD ($)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label className="dark:text-zinc-100">Date Format</Label>
                            <Select value={dateFormat} onValueChange={onDateFormatChange}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="dmy">DD/MM/YYYY</SelectItem>
                                    <SelectItem value="mdy">MM/DD/YYYY</SelectItem>
                                    <SelectItem value="ymd">YYYY-MM-DD</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Notification Preferences */}
            <Card data-tutorial="settings-notifications">
                <CardHeader>
                    <CardTitle className="dark:text-zinc-100">Notification Preferences</CardTitle>
                    <CardDescription className="dark:text-zinc-400">
                        Choose how and when you receive notifications.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label className="dark:text-zinc-100">In-App Notifications</Label>
                            <p className="text-sm text-muted-foreground dark:text-zinc-500">
                                Show notifications in the dashboard.
                            </p>
                        </div>
                        <Switch
                            checked={inAppNotifications}
                            onCheckedChange={onInAppNotificationsChange}
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label className="dark:text-zinc-100">Email Notifications</Label>
                            <p className="text-sm text-muted-foreground dark:text-zinc-500">
                                Receive alerts via email.
                            </p>
                        </div>
                        <Switch
                            checked={emailNotifications}
                            onCheckedChange={onEmailNotificationsChange}
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label className="dark:text-zinc-100">LINE Notifications</Label>
                            <p className="text-sm text-muted-foreground dark:text-zinc-500">
                                Receive alerts via LINE.
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

    // สามารถเพิ่ม useEffect เพื่อ sync inAppNotifications/emailNotifications/lineNotifications กับ localStorage ถ้าต้องการ

    return (
        <ProtectedRoute>
            <DashboardLayout>
                <div className="space-y-6">
                    {/* Page Header */}
                    <div data-tutorial="settings-header" className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-zinc-100">
                                Settings
                            </h1>
                            <p className="text-sm text-slate-500 dark:text-zinc-500 mt-1">
                                Manage your account preferences and alert configurations.
                            </p>
                        </div>
                    </div>

                    {/* Settings Tabs */}
                    <Tabs defaultValue="general" className="space-y-6">
                        <TabsList data-tutorial="settings-tabs" className="grid w-full max-w-md grid-cols-2">
                            <TabsTrigger value="general" className="flex items-center gap-2">
                                <Settings2 className="h-4 w-4" />
                                General
                            </TabsTrigger>
                            <TabsTrigger data-tutorial="settings-alerts-tab" value="alerts" className="flex items-center gap-2">
                                <Bell className="h-4 w-4" />
                                Alert Rules
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
                                onInAppNotificationsChange={setInAppNotifications}
                                onEmailNotificationsChange={setEmailNotifications}
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
