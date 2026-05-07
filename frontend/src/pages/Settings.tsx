// =============================================================================
// Settings Page - User Preferences and Alert Configuration
// =============================================================================

import { useEffect, useState } from 'react';
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
            <Card>
                <CardHeader>
                    <CardTitle>Appearance</CardTitle>
                    <CardDescription>
                        Customize how the dashboard looks and feels.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label>Dark Mode</Label>
                            <p className="text-sm text-muted-foreground">
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
                            <Label>Compact View</Label>
                            <p className="text-sm text-muted-foreground">
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
            <Card>
                <CardHeader>
                    <CardTitle>Regional</CardTitle>
                    <CardDescription>
                        Configure language and regional preferences.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label>Language</Label>
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
                            <Label>Timezone</Label>
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
                            <Label>Currency</Label>
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
                            <Label>Date Format</Label>
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
            <Card>
                <CardHeader>
                    <CardTitle>Notification Preferences</CardTitle>
                    <CardDescription>
                        Choose how and when you receive notifications.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label>In-App Notifications</Label>
                            <p className="text-sm text-muted-foreground">
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
                            <Label>Email Notifications</Label>
                            <p className="text-sm text-muted-foreground">
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
                            <Label>LINE Notifications</Label>
                            <p className="text-sm text-muted-foreground">
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
    const [language, setLanguage] = useState('th');
    const [timezone, setTimezone] = useState('asia-bangkok');
    const [currency, setCurrency] = useState('thb');
    const [dateFormat, setDateFormat] = useState('dmy');
    const [inAppNotifications, setInAppNotifications] = useState(true);
    const [emailNotifications, setEmailNotifications] = useState(false);
    const [lineNotifications, setLineNotifications] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem('dashboardSettings');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                setLanguage(parsed.language ?? 'th');
                setTimezone(parsed.timezone ?? 'asia-bangkok');
                setCurrency(parsed.currency ?? 'thb');
                setDateFormat(parsed.dateFormat ?? 'dmy');
                setInAppNotifications(parsed.inAppNotifications ?? true);
                setEmailNotifications(parsed.emailNotifications ?? false);
                setLineNotifications(parsed.lineNotifications ?? false);
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
                inAppNotifications,
                emailNotifications,
                lineNotifications,
            })
        );
    }, [language, timezone, currency, dateFormat, inAppNotifications, emailNotifications, lineNotifications]);

    return (
        <ProtectedRoute>
            <DashboardLayout>
                <div className="space-y-6">
                    {/* Page Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                                Settings
                            </h1>
                            <p className="text-sm text-slate-500 mt-1">
                                Manage your account preferences and alert configurations.
                            </p>
                        </div>
                    </div>

                    {/* Settings Tabs */}
                    <Tabs defaultValue="general" className="space-y-6">
                        <TabsList className="grid w-full max-w-md grid-cols-2">
                            <TabsTrigger value="general" className="flex items-center gap-2">
                                <Settings2 className="h-4 w-4" />
                                General
                            </TabsTrigger>
                            <TabsTrigger value="alerts" className="flex items-center gap-2">
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
