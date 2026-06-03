export const settingsEn = {
    page: {
        title: 'Settings',
        subtitle: 'Manage your account preferences and alert configurations.',
        tabs: {
            general: 'General',
            alertRules: 'Alert Rules',
        },
    },
    general: {
        appearance: {
            title: 'Appearance',
            description: 'Customize how the dashboard looks and feels.',
            darkMode: {
                label: 'Dark Mode',
                description: 'Switch to dark theme for low-light environments.',
            },
            compactView: {
                label: 'Compact View',
                description: 'Use smaller spacing to fit more data on screen.',
            },
        },
        regional: {
            title: 'Regional',
            description: 'Configure language and regional preferences.',
            language: 'Language',
            timezone: 'Timezone',
            currency: 'Currency',
            dateFormat: 'Date Format',
            languages: {
                th: 'ไทย (Thai)',
                en: 'English',
            },
            timezones: {
                asiaBangkok: 'Asia/Bangkok (UTC+7)',
                utc: 'UTC',
            },
            currencies: {
                thb: 'THB (฿)',
                usd: 'USD ($)',
            },
            dateFormats: {
                dmy: 'DD/MM/YYYY',
                mdy: 'MM/DD/YYYY',
                ymd: 'YYYY-MM-DD',
            },
        },
        notifications: {
            title: 'Notification Preferences',
            description: 'Choose how and when you receive notifications.',
            inApp: {
                label: 'In-App Notifications',
                description: 'Show notifications in the dashboard.',
            },
            email: {
                label: 'Email Notifications',
                description: 'Receive alerts via email.',
            },
            line: {
                label: 'LINE Notifications',
                description: 'Receive alerts via LINE.',
            },
        },
    },
    alertRules: {
        header: {
            title: 'Watchdog Rules',
            description:
                'Automatically monitor campaigns and get notified when metrics breach thresholds.',
            addRule: 'Add Rule',
        },
        empty: {
            title: 'No Alert Rules',
            description:
                'Create your first alert rule to automatically monitor campaign metrics and get notified when thresholds are breached.',
            createRule: 'Create Rule',
        },
        table: {
            active: 'Active',
            name: 'Name',
            condition: 'Condition',
            severity: 'Severity',
            type: 'Type',
            actions: 'Actions',
        },
        status: {
            loadFailed: 'Failed to load rules. Please try again.',
        },
        metrics: {
            ctr: 'CTR',
            cpc: 'CPC',
            roas: 'ROAS',
            spend: 'Spend',
            impressions: 'Impressions',
            clicks: 'Clicks',
            conversions: 'Conversions',
        },
        metricOptions: {
            ctr: 'CTR (Click-Through Rate)',
            cpc: 'CPC (Cost Per Click)',
            roas: 'ROAS (Return on Ad Spend)',
            spend: 'Spend (Total Cost)',
            impressions: 'Impressions',
            clicks: 'Clicks',
            conversions: 'Conversions',
        },
        operators: {
            gt: 'Greater than (>)',
            lt: 'Less than (<)',
            gte: 'Greater or equal (≥)',
            lte: 'Less or equal (≤)',
            eq: 'Equal to (=)',
        },
        severity: {
            critical: 'Critical',
            warning: 'Warning',
            info: 'Info',
        },
        types: {
            preset: 'Preset',
            custom: 'Custom',
        },
        tooltips: {
            presetEdit: 'Preset rules cannot be edited',
            edit: 'Edit rule',
            presetDelete: 'Preset rules cannot be deleted',
            delete: 'Delete rule',
        },
        toasts: {
            created: 'Rule created',
            createdDescription: 'Alert rule has been created successfully.',
            createFailed: 'Failed to create rule',
            updated: 'Rule updated',
            updatedDescription: 'Alert rule has been updated.',
            updateFailed: 'Failed to update rule',
            toggleFailed: 'Failed to toggle rule',
            deleted: 'Rule deleted',
            deletedDescription: 'Alert rule has been removed.',
            deleteFailed: 'Failed to delete rule',
            unknownError: 'Unknown error',
        },
        deleteDialog: {
            title: 'Delete Alert Rule',
            description:
                'Are you sure you want to delete "{name}"? This action cannot be undone.',
            cancel: 'Cancel',
            delete: 'Delete',
        },
        form: {
            createTitle: 'Create Alert Rule',
            editTitle: 'Edit Alert Rule',
            createDescription: 'Create a new rule to monitor your campaigns.',
            editDescription: 'Modify the alert rule configuration.',
            fields: {
                name: 'Rule Name',
                metric: 'Metric',
                condition: 'Condition',
                threshold: 'Threshold',
                severity: 'Severity',
                description: 'Description (Optional)',
            },
            placeholders: {
                name: 'e.g., Low CTR Alert',
                metric: 'Select metric',
                operator: 'Select operator',
                threshold: '1.0',
                severity: 'Select severity',
                description: 'Describe what this rule monitors...',
            },
            help: {
                threshold: 'The value to compare against',
            },
            actions: {
                cancel: 'Cancel',
                saveChanges: 'Save Changes',
                createRule: 'Create Rule',
            },
            validation: {
                nameRequired: 'Name is required',
                nameTooLong: 'Name too long',
                metricRequired: 'Metric is required',
                operatorRequired: 'Operator is required',
                thresholdPositive: 'Threshold must be positive',
            },
        },
    },
} as const;
