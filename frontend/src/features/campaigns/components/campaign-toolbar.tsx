// src/features/campaigns/components/campaign-toolbar.tsx
// =============================================================================
// Campaign Toolbar - Search and Filter Controls (Responsive Redesign)
// =============================================================================

import { useState, useEffect } from 'react';
import { Search, X, ListFilter, SlidersHorizontal } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
    DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    SheetFooter,
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { DashboardDateFilter } from '@/features/dashboard/components/dashboard-date-filter';
import type { PeriodEnum, WeekStartsOn } from '@/features/dashboard/schemas';

// =============================================================================
// Types
// =============================================================================

export interface CampaignToolbarProps {
    search: string;
    onSearchChange: (value: string) => void;
    status: Set<string>;
    onStatusChange: (value: Set<string>) => void;
    platform: Set<string>;
    onPlatformChange: (value: Set<string>) => void;
    isLoading?: boolean;
    period: PeriodEnum;
    onPeriodChange: (value: PeriodEnum) => void;
    customRange?: { from: Date; to: Date };
    onCustomRangeChange?: (value: { from: Date; to: Date }) => void;
    weekStartsOn: WeekStartsOn;
    onWeekStartsOnChange: (value: WeekStartsOn) => void;
    showSelectedOnly: boolean;
    onShowSelectedOnlyChange: (value: boolean) => void;
    selectedCount: number;
}

// =============================================================================
// Options
// =============================================================================

const STATUS_OPTIONS = [
    { value: 'ACTIVE', label: 'Active' },
    { value: 'PAUSED', label: 'Paused' },
    { value: 'COMPLETED', label: 'Completed' },
] as const;

const PLATFORM_OPTIONS = [
    { value: 'FACEBOOK', label: 'Facebook' },
    { value: 'GOOGLE_ADS', label: 'Google Ads' },
    { value: 'TIKTOK', label: 'TikTok' },
    { value: 'LINE_ADS', label: 'Line Ads' },
] as const;

// =============================================================================
// Helpers
// =============================================================================

function toggleSetItem(
    currentSet: Set<string>,
    onChange: (val: Set<string>) => void,
    value: string
) {
    const next = new Set(currentSet);
    if (next.has('ALL')) next.delete('ALL');
    if (next.has(value)) {
        next.delete(value);
    } else {
        next.add(value);
    }
    onChange(next.size === 0 ? new Set(['ALL']) : next);
}

// =============================================================================
// Active filter count helper
// =============================================================================

function getActiveFilterCount(status: Set<string>, platform: Set<string>) {
    let count = 0;
    if (!status.has('ALL')) count += status.size;
    if (!platform.has('ALL')) count += platform.size;
    return count;
}

// =============================================================================
// Desktop Filter Dropdowns (md+)
// =============================================================================

function StatusDropdown({
    status,
    onStatusChange,
}: {
    status: Set<string>;
    onStatusChange: (v: Set<string>) => void;
}) {
    const active = !status.has('ALL');

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    className={`h-9 border-dashed rounded-lg px-3 font-normal gap-1.5 transition-all ${
                        active
                            ? 'border-blue-300 bg-blue-50 text-blue-700 hover:bg-blue-100'
                            : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                >
                    <ListFilter className={`h-3.5 w-3.5 shrink-0 ${active ? 'text-blue-500' : 'opacity-40'}`} />
                    Status
                    {active && (
                        <Badge className="ml-0.5 h-4 px-1 text-[10px] bg-blue-500 text-white rounded-full shrink-0">
                            {status.size}
                        </Badge>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48 p-1.5 rounded-xl shadow-xl border-gray-100">
                <DropdownMenuLabel className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider px-2 pb-1">
                    Filter by Status
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="-mx-1.5 mb-1" />
                <DropdownMenuCheckboxItem
                    checked={status.has('ALL')}
                    onCheckedChange={() => onStatusChange(new Set(['ALL']))}
                    className="rounded-lg cursor-pointer text-sm"
                >
                    All Statuses
                </DropdownMenuCheckboxItem>
                {STATUS_OPTIONS.map((opt) => (
                    <DropdownMenuCheckboxItem
                        key={opt.value}
                        checked={status.has(opt.value)}
                        onCheckedChange={() => toggleSetItem(status, onStatusChange, opt.value)}
                        className="rounded-lg cursor-pointer text-sm"
                    >
                        {opt.label}
                    </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

function PlatformDropdown({
    platform,
    onPlatformChange,
}: {
    platform: Set<string>;
    onPlatformChange: (v: Set<string>) => void;
}) {
    const active = !platform.has('ALL');

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    className={`h-9 border-dashed rounded-lg px-3 font-normal gap-1.5 transition-all ${
                        active
                            ? 'border-indigo-300 bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
                            : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                >
                    <ListFilter className={`h-3.5 w-3.5 shrink-0 ${active ? 'text-indigo-500' : 'opacity-40'}`} />
                    Platform
                    {active && (
                        <Badge className="ml-0.5 h-4 px-1 text-[10px] bg-indigo-500 text-white rounded-full shrink-0">
                            {platform.size}
                        </Badge>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48 p-1.5 rounded-xl shadow-xl border-gray-100">
                <DropdownMenuLabel className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider px-2 pb-1">
                    Filter by Platform
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="-mx-1.5 mb-1" />
                <DropdownMenuCheckboxItem
                    checked={platform.has('ALL')}
                    onCheckedChange={() => onPlatformChange(new Set(['ALL']))}
                    className="rounded-lg cursor-pointer text-sm"
                >
                    All Platforms
                </DropdownMenuCheckboxItem>
                {PLATFORM_OPTIONS.map((opt) => (
                    <DropdownMenuCheckboxItem
                        key={opt.value}
                        checked={platform.has(opt.value)}
                        onCheckedChange={() => toggleSetItem(platform, onPlatformChange, opt.value)}
                        className="rounded-lg cursor-pointer text-sm"
                    >
                        {opt.label}
                    </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

// =============================================================================
// Mobile Filter Sheet (< md)
// =============================================================================

function MobileFilterSheet({
    status,
    onStatusChange,
    platform,
    onPlatformChange,
    activeCount,
}: {
    status: Set<string>;
    onStatusChange: (v: Set<string>) => void;
    platform: Set<string>;
    onPlatformChange: (v: Set<string>) => void;
    activeCount: number;
}) {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    className={`h-9 rounded-lg px-3 gap-1.5 font-normal flex-shrink-0 transition-all ${
                        activeCount > 0
                            ? 'border-blue-300 bg-blue-50 text-blue-700'
                            : 'border-gray-200 text-gray-600'
                    }`}
                >
                    <SlidersHorizontal className="h-3.5 w-3.5" />
                    Filters
                    {activeCount > 0 && (
                        <Badge className="h-4 px-1 text-[10px] bg-blue-500 text-white rounded-full">
                            {activeCount}
                        </Badge>
                    )}
                </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="rounded-t-2xl px-4 pb-8">
                <SheetHeader className="pb-4">
                    <SheetTitle className="text-left text-base font-semibold">Filters</SheetTitle>
                </SheetHeader>

                {/* Status Section */}
                <div className="mb-5">
                    <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Status</p>
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => onStatusChange(new Set(['ALL']))}
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${
                                status.has('ALL')
                                    ? 'bg-gray-900 text-white border-gray-900'
                                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                            }`}
                        >
                            All
                        </button>
                        {STATUS_OPTIONS.map((opt) => (
                            <button
                                key={opt.value}
                                onClick={() => toggleSetItem(status, onStatusChange, opt.value)}
                                className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${
                                    status.has(opt.value)
                                        ? 'bg-blue-500 text-white border-blue-500'
                                        : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                                }`}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Platform Section */}
                <div className="mb-6">
                    <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Platform</p>
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => onPlatformChange(new Set(['ALL']))}
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${
                                platform.has('ALL')
                                    ? 'bg-gray-900 text-white border-gray-900'
                                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                            }`}
                        >
                            All
                        </button>
                        {PLATFORM_OPTIONS.map((opt) => (
                            <button
                                key={opt.value}
                                onClick={() => toggleSetItem(platform, onPlatformChange, opt.value)}
                                className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${
                                    platform.has(opt.value)
                                        ? 'bg-indigo-500 text-white border-indigo-500'
                                        : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                                }`}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>
                </div>

                <SheetFooter>
                    <Button
                        variant="outline"
                        className="flex-1 rounded-xl h-11"
                        onClick={() => {
                            onStatusChange(new Set(['ALL']));
                            onPlatformChange(new Set(['ALL']));
                        }}
                    >
                        Clear All
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}

// =============================================================================
// Main Component
// =============================================================================

export function CampaignToolbar({
    search,
    onSearchChange,
    status,
    onStatusChange,
    platform,
    onPlatformChange,
    isLoading = false,
    period,
    onPeriodChange,
    customRange,
    onCustomRangeChange,
    weekStartsOn,
    onWeekStartsOnChange,
    showSelectedOnly,
    onShowSelectedOnlyChange,
    selectedCount,
}: CampaignToolbarProps) {
    const [query, setQuery] = useState(search);

    useEffect(() => {
        setQuery(search);
    }, [search]);

    const handleSearch = () => onSearchChange(query);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') handleSearch();
    };

    const handleClearSearch = () => {
        setQuery('');
        onSearchChange('');
    };

    const activeFilterCount = getActiveFilterCount(status, platform);

    return (
        <div className="p-3 sm:p-4 rounded-2xl bg-white border border-gray-100 shadow-sm space-y-3">

            {/* ── Row 1: Search + Search Button ── */}
            <div className="flex items-center gap-2">
                <div
                    data-tutorial="campaigns-search"
                    className="relative flex-1 min-w-0 group"
                >
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-gray-400 group-focus-within:text-primary transition-colors duration-200" />
                    </div>
                    <Input
                        type="text"
                        placeholder="Search campaigns..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="pl-9 pr-9 h-9 w-full bg-gray-50/50 border-transparent hover:bg-gray-50 focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/5 rounded-xl transition-all duration-200 text-sm"
                        disabled={isLoading}
                    />
                    {query && (
                        <button
                            onClick={handleClearSearch}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <X className="h-3.5 w-3.5" />
                        </button>
                    )}
                </div>

                <Button
                    onClick={handleSearch}
                    disabled={isLoading}
                    size="sm"
                    className="h-9 rounded-xl px-4 flex-shrink-0 bg-primary text-primary-foreground shadow-md shadow-primary/20 hover:shadow-primary/35 hover:bg-primary/90 transition-all active:scale-95 text-sm"
                >
                    Search
                </Button>
            </div>

            {/* ── Row 2: Filters + Date + Selected ── */}
            <div
                data-tutorial="campaigns-filters"
                className="flex flex-wrap items-center gap-2"
            >
                {/* Mobile: single Filters sheet button */}
                <div className="md:hidden">
                    <MobileFilterSheet
                        status={status}
                        onStatusChange={onStatusChange}
                        platform={platform}
                        onPlatformChange={onPlatformChange}
                        activeCount={activeFilterCount}
                    />
                </div>

                {/* Desktop: inline filter dropdowns */}
                <div className="hidden md:flex items-center gap-2">
                    <StatusDropdown status={status} onStatusChange={onStatusChange} />
                    <PlatformDropdown platform={platform} onPlatformChange={onPlatformChange} />
                    <div className="h-5 w-px bg-gray-200 mx-0.5" />
                </div>

                {/* Selected Only toggle */}
                <Button
                    data-tutorial="campaigns-selection-toggle"
                    variant={showSelectedOnly ? 'secondary' : 'ghost'}
                    size="sm"
                    onClick={() => onShowSelectedOnlyChange(!showSelectedOnly)}
                    disabled={selectedCount === 0}
                    className={`h-9 rounded-lg px-3 font-normal text-sm transition-all flex-shrink-0 ${
                        showSelectedOnly
                            ? 'bg-gray-900 text-white hover:bg-gray-800 shadow-sm'
                            : 'text-gray-500 hover:bg-gray-100 hover:text-gray-800'
                    } disabled:opacity-40 disabled:cursor-not-allowed`}
                >
                    Selected
                    {selectedCount > 0 && (
                        <Badge className="ml-1.5 h-4 px-1.5 text-[10px] rounded-full bg-current/20">
                            {selectedCount}
                        </Badge>
                    )}
                </Button>

                {/* Active filter chips — show what's currently selected */}
                {(!status.has('ALL') || !platform.has('ALL')) && (
                    <div className="flex items-center flex-wrap gap-1.5">
                        {/* Status chips */}
                        {!status.has('ALL') && STATUS_OPTIONS.filter((o) => status.has(o.value)).map((opt) => (
                            <span
                                key={opt.value}
                                className="inline-flex items-center gap-1 h-6 pl-2 pr-1 rounded-full text-[11px] font-medium bg-blue-100 text-blue-700 border border-blue-200"
                            >
                                {opt.label}
                                <button
                                    onClick={() => toggleSetItem(status, onStatusChange, opt.value)}
                                    className="flex items-center justify-center w-3.5 h-3.5 rounded-full hover:bg-blue-200 transition-colors"
                                >
                                    <X className="h-2.5 w-2.5" />
                                </button>
                            </span>
                        ))}
                        {/* Platform chips */}
                        {!platform.has('ALL') && PLATFORM_OPTIONS.filter((o) => platform.has(o.value)).map((opt) => (
                            <span
                                key={opt.value}
                                className="inline-flex items-center gap-1 h-6 pl-2 pr-1 rounded-full text-[11px] font-medium bg-indigo-100 text-indigo-700 border border-indigo-200"
                            >
                                {opt.label}
                                <button
                                    onClick={() => toggleSetItem(platform, onPlatformChange, opt.value)}
                                    className="flex items-center justify-center w-3.5 h-3.5 rounded-full hover:bg-indigo-200 transition-colors"
                                >
                                    <X className="h-2.5 w-2.5" />
                                </button>
                            </span>
                        ))}
                    </div>
                )}

                {/* Date Filter — auto-pushed to right */}
                <div className="ml-auto flex-shrink-0">
                    <div className="h-9 [&>button]:h-9 [&>button]:rounded-lg [&>button]:border-gray-200 [&>button]:text-sm">
                        <DashboardDateFilter
                            value={period}
                            onValueChange={onPeriodChange}
                            customRange={customRange}
                            onCustomRangeChange={onCustomRangeChange}
                            weekStartsOn={weekStartsOn}
                            onWeekStartsOnChange={onWeekStartsOnChange}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CampaignToolbar;