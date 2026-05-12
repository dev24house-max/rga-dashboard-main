import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Search, Check, Globe } from 'lucide-react';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

interface GSCSiteSelectionDialogProps {
    isOpen: boolean;
    isLoading: boolean;
    sites: any[];
    onSelect: (siteUrl: string) => void;
    onCancel: () => void;
}

export function GSCSiteSelectionDialog({
    isOpen,
    isLoading,
    sites,
    onSelect,
    onCancel,
}: GSCSiteSelectionDialogProps) {
    const [selectedSiteUrl, setSelectedSiteUrl] = useState<string | null>(null);

    const handleConfirm = () => {
        if (selectedSiteUrl) {
            onSelect(selectedSiteUrl);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Search className="w-5 h-5 text-slate-700" />
                        Select Search Console Property
                    </DialogTitle>
                    <DialogDescription>
                        Choose the website property you want to sync data from.
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-8 space-y-4">
                            <LoadingSpinner size="lg" />
                            <p className="text-sm text-slate-500">Fetching properties...</p>
                        </div>
                    ) : sites.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-sm text-slate-500">No properties found.</p>
                        </div>
                    ) : (
                        <div className="max-h-[300px] overflow-y-auto space-y-2 pr-1">
                            {sites.map((site) => (
                                <div
                                    key={site.siteUrl}
                                    className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${selectedSiteUrl === site.siteUrl
                                            ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500'
                                            : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                                        }`}
                                    onClick={() => setSelectedSiteUrl(site.siteUrl)}
                                >
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className={`p-2 rounded-md ${selectedSiteUrl === site.siteUrl ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500'}`}>
                                            <Globe className="w-4 h-4" />
                                        </div>
                                        <div className="flex flex-col min-w-0">
                                            <span className="text-sm font-medium text-slate-900 truncate">
                                                {site.siteUrl}
                                            </span>
                                            <span className="text-xs text-slate-500">
                                                Permission: {site.permissionLevel || 'Unknown'}
                                            </span>
                                        </div>
                                    </div>
                                    {selectedSiteUrl === site.siteUrl && (
                                        <Check className="w-5 h-5 text-blue-600 flex-shrink-0" />
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onCancel}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleConfirm}
                        disabled={!selectedSiteUrl || isLoading}
                    >
                        Confirm Selection
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
