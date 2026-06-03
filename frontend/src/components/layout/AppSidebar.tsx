// frontend/src/components/layout/AppSidebar.tsx
// =============================================================================
// Application Sidebar - Premium Design
// Features: Glassmorphism, Gradient Active States, Smooth Animations
// =============================================================================

import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'wouter';
import { useAuthStore, selectUser } from '@/stores/auth-store';
import { UserRole } from '@/types/enums';
import { Sidebar, useSidebar } from '@/components/ui/sidebar';
import {
    BarChart3,
    Database,
    FileText,
    LogOut,
    Search,
    Settings,
    TrendingUp,
    Users,
    Zap,
    ChevronRight,
    Sparkles,
    AlertCircle,
} from 'lucide-react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import logo from '@/assets/logo.png';
import type { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/i18n/use-translation';

// =============================================================================
// Types & Menu Configuration
// =============================================================================

interface NavItem {
    labelKey: string;
    href: string;
    icon: LucideIcon;
    comingSoon?: boolean;
    adminOnly?: boolean;
}

interface NavGroup {
    id: 'analytics' | 'intelligence' | 'system';
    titleKey: string;
    items: NavItem[];
}

const NAV_GROUPS: NavGroup[] = [
    {
        id: 'analytics',
        titleKey: 'groups.analytics',
        items: [
            {
                labelKey: 'items.overview',
                href: '/dashboard',
                icon: BarChart3,
            },
            { labelKey: 'items.campaigns', href: '/campaigns', icon: Zap },
            {
                labelKey: 'items.dataSources',
                href: '/data-sources',
                icon: Database,
            },
        ],
    },
    {
        id: 'intelligence',
        titleKey: 'groups.intelligence',
        items: [
            {
                labelKey: 'items.seoWeb',
                href: '/seo-web-analytics',
                icon: Search,
            },
            {
                labelKey: 'items.aiInsightsTools',
                href: '/ai-insights',
                icon: Sparkles,
            },
            {
                labelKey: 'items.ecommerceInsights',
                href: '/ecommerce-insights',
                icon: TrendingUp,
            },
        ],
    },
    {
        id: 'system',
        titleKey: 'groups.system',
        items: [
            { labelKey: 'items.settings', href: '/settings', icon: Settings },
            { labelKey: 'items.reports', href: '/reports', icon: FileText },
        ],
    },
];

function getRoleLabelKey(role?: string | null) {
    switch (role) {
        case UserRole.ADMIN:
        case 'ADMIN':
            return 'profile.roles.admin';
        case UserRole.MANAGER:
        case 'MANAGER':
            return 'profile.roles.manager';
        case UserRole.CLIENT:
        case 'CLIENT':
            return 'profile.roles.client';
        case UserRole.VIEWER:
        case 'VIEWER':
            return 'profile.roles.viewer';
        default:
            return undefined;
    }
}

// =============================================================================
// Component
// =============================================================================

export function AppSidebar() {
    const { t } = useTranslation('sidebar');
    const [location, setLocation] = useLocation();
    const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
    const logoutDialogTimerRef = useRef<number | null>(null);
    const { isMobile, openMobile, setOpenMobile } = useSidebar();
    const user = useAuthStore(selectUser);
    const logout = useAuthStore((state) => state.logout);

    useEffect(() => {
        return () => {
            if (logoutDialogTimerRef.current !== null) {
                window.clearTimeout(logoutDialogTimerRef.current);
            }
        };
    }, []);

    // Sub-route matching (e.g., /campaigns/abc123 highlights /campaigns)
    const isActive = (url: string) =>
        location === url || location.startsWith(`${url}/`);

    const handleLogoutClick = () => {
        if (isMobile && openMobile) {
            setOpenMobile(false);

            if (logoutDialogTimerRef.current !== null) {
                window.clearTimeout(logoutDialogTimerRef.current);
            }

            logoutDialogTimerRef.current = window.setTimeout(() => {
                setIsLogoutDialogOpen(true);
                logoutDialogTimerRef.current = null;
            }, 300);
            return;
        }

        setIsLogoutDialogOpen(true);
    };

    const handleConfirmLogout = () => {
        setIsLogoutDialogOpen(false);
        logout();
        setLocation('/login');
    };

    const roleLabelKey = getRoleLabelKey(user?.role);
    const roleLabel = roleLabelKey
        ? t(roleLabelKey)
        : user?.role || t('profile.fallbackRole');

    // Add admin-only items dynamically
    const getNavGroups = (): NavGroup[] => {
        return NAV_GROUPS.map((group) => {
            if (group.id === 'system' && user?.role === UserRole.ADMIN) {
                return {
                    ...group,
                    items: [
                        ...group.items,
                        {
                            labelKey: 'items.users',
                            href: '/users',
                            icon: Users,
                            adminOnly: true,
                        },
                    ],
                };
            }
            return group;
        });
    };

    return (
        <>
            <Sidebar className="border-r border-slate-200/60 bg-white/80 dark:bg-slate-950/90 dark:border-slate-800/60 backdrop-blur-xl shadow-lg shadow-slate-200/20 z-50">
                <div className="flex flex-col h-full w-full text-slate-900 dark:text-slate-100">
                    {/* Header / Logo */}
                    <div className="px-5 py-5 pb-3">
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            className="flex items-center gap-3 cursor-pointer group"
                        >
                            <div className="relative">
                                <div className="absolute inset-0 bg-orange-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                <img
                                    src={logo}
                                    alt={t('logoAlt')}
                                    className="h-10 w-auto object-contain relative z-10"
                                />
                            </div>
                        </motion.div>
                    </div>

                    {/* Navigation Menu */}
                    <div className="flex-1 min-h-0 overflow-y-auto px-4 py-6 space-y-8 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
                        {getNavGroups().map((group) => (
                            <div key={group.id} className="space-y-2">
                                <h3 className="px-3 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3 select-none flex items-center gap-2">
                                    {t(group.titleKey)}
                                    <div className="h-px flex-1 bg-slate-100/50 dark:bg-slate-800/50" />
                                </h3>

                                <div className="space-y-1">
                                    {group.items.map((item) => {
                                        const Icon = item.icon;
                                        const active = isActive(item.href);

                                        return (
                                            <button
                                                key={item.href}
                                                onClick={() =>
                                                    !item.comingSoon &&
                                                    setLocation(item.href)
                                                }
                                                disabled={item.comingSoon}
                                                className={cn(
                                                    'w-full group relative flex items-center gap-3 px-3 py-3 sm:px-4 sm:py-2.5 rounded-xl transition-all duration-300',
                                                    active
                                                        ? 'text-white shadow-md shadow-orange-500/20'
                                                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100',
                                                    item.comingSoon &&
                                                        'opacity-50 cursor-not-allowed'
                                                )}
                                            >
                                                {/* Active Background Gradient */}
                                                {active && (
                                                    <motion.div
                                                        layoutId="sidebar-active-bg"
                                                        className="absolute inset-0 rounded-xl bg-linear-to-r from-orange-500 to-amber-500"
                                                        initial={false}
                                                        transition={{
                                                            type: 'spring',
                                                            stiffness: 300,
                                                            damping: 30,
                                                        }}
                                                    />
                                                )}

                                                {/* Icon */}
                                                <Icon
                                                    className={cn(
                                                        'w-[18px] h-[18px] relative z-10 transition-transform duration-300 group-hover:scale-110',
                                                        active
                                                            ? 'text-white'
                                                            : 'text-orange-500 dark:text-orange-400'
                                                    )}
                                                />

                                                {/* Label */}
                                                <span
                                                    className={cn(
                                                        'text-sm font-medium relative z-10 tracking-wide',
                                                        active
                                                            ? 'text-white'
                                                            : 'text-slate-900 dark:text-slate-100'
                                                    )}
                                                >
                                                    {t(item.labelKey)}
                                                </span>

                                                {/* Coming Soon Badge */}
                                                {item.comingSoon && (
                                                    <span className="ml-auto text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-400 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                                                        {t('badges.soon')}
                                                    </span>
                                                )}

                                                {/* Active External Indicator */}
                                                {active && (
                                                    <motion.div
                                                        initial={{
                                                            opacity: 0,
                                                            x: -5,
                                                        }}
                                                        animate={{
                                                            opacity: 1,
                                                            x: 0,
                                                        }}
                                                        className="ml-auto relative z-10"
                                                    >
                                                        <ChevronRight className="w-4 h-4 text-white/80" />
                                                    </motion.div>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Footer / User Profile */}
                    <div className="p-4 border-t border-slate-100/60 bg-slate-50/50 dark:bg-slate-950/50 dark:border-slate-800/60 backdrop-blur-sm">
                        <div className="flex items-center gap-3 px-2">
                            {/* Avatar */}
                            <div className="relative">
                                <div className="w-9 h-9 rounded-full bg-linear-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-medium text-sm shadow-md shadow-indigo-500/20 ring-2 ring-white">
                                    {user?.name?.charAt(0) || 'U'}
                                </div>
                                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
                                    {user?.name || t('profile.fallbackName')}
                                </p>
                                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 truncate font-medium">
                                    {roleLabel}
                                </p>
                            </div>

                            {/* Logout Button */}
                            <button
                                onClick={handleLogoutClick}
                                className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors dark:text-slate-400 dark:hover:bg-red-500/10 dark:hover:text-red-300"
                                title={t('actions.signOut')}
                            >
                                <LogOut className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </Sidebar>

            {/* Logout Confirmation Dialog */}
            <AlertDialog
                open={isLogoutDialogOpen}
                onOpenChange={setIsLogoutDialogOpen}
            >
                <AlertDialogContent className="sm:max-w-[425px]">
                    <AlertDialogHeader>
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                                <AlertCircle className="h-5 w-5 text-red-600" />
                            </div>
                            <AlertDialogTitle className="text-lg">
                                {t('logoutDialog.title')}
                            </AlertDialogTitle>
                        </div>
                    </AlertDialogHeader>
                    <AlertDialogDescription className="text-base">
                        {t('logoutDialog.description')}
                    </AlertDialogDescription>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="bg-slate-100 text-slate-900 hover:bg-slate-200">
                            {t('logoutDialog.cancel')}
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleConfirmLogout}
                            className="bg-red-600 text-white hover:bg-red-700"
                        >
                            {t('logoutDialog.confirm')}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
