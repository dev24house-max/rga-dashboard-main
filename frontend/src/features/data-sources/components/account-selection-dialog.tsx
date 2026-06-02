/**
 * Account Selection Dialog
 *
 * Modal for selecting an ad account after OAuth callback.
 * Shows list of available accounts with radio selection.
 */

import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import type { TempAccount } from '../types';
import { useTranslation } from '@/i18n/use-translation';

interface AccountSelectionDialogProps {
    /** Whether dialog is open */
    isOpen: boolean;
    /** Callback when open state changes */
    onOpenChange: (open: boolean) => void;
    /** List of available accounts */
    accounts: TempAccount[];
    /** Callback when user confirms selection */
    onConfirm: (accountId: string) => void;
    /** Whether confirmation is in progress */
    isPending?: boolean;
    /** Platform name for display */
    platformName?: string;
}

export function AccountSelectionDialog({
    isOpen,
    onOpenChange,
    accounts,
    onConfirm,
    isPending = false,
    platformName,
}: AccountSelectionDialogProps) {
    const { t } = useTranslation('dataSources');
    const [selectedAccountId, setSelectedAccountId] = useState<string>('');
    const displayPlatformName = platformName ?? t('platforms.adPlatform');

    const handleConfirm = () => {
        if (selectedAccountId) {
            onConfirm(selectedAccountId);
        }
    };

    const handleOpenChange = (open: boolean) => {
        if (!open) {
            // Reset selection when closing
            setSelectedAccountId('');
        }
        onOpenChange(open);
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>
                        {t('accountDialog.title', {
                            platformName: displayPlatformName,
                        })}
                    </DialogTitle>
                    <DialogDescription>
                        {t('accountDialog.description')}
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4">
                    {accounts.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            {t('accountDialog.empty')}
                        </div>
                    ) : (
                        <RadioGroup
                            value={selectedAccountId}
                            onValueChange={setSelectedAccountId}
                            className="gap-3"
                        >
                            {accounts.map((account) => (
                                <div
                                    key={account.id}
                                    className="flex items-center space-x-3 rounded-lg border p-4 hover:bg-muted/50 transition-colors cursor-pointer"
                                    onClick={() =>
                                        setSelectedAccountId(account.id)
                                    }
                                >
                                    <RadioGroupItem
                                        value={account.id}
                                        id={account.id}
                                    />
                                    <Label
                                        htmlFor={account.id}
                                        className="flex-1 cursor-pointer"
                                    >
                                        <div className="font-medium">
                                            {account.name}
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            {t('accountDialog.idLabel')}{' '}
                                            {account.id}
                                            {account.status && (
                                                <span className="ml-2">
                                                    {t(
                                                        'accountDialog.statusSeparator'
                                                    )}{' '}
                                                    {account.status}
                                                </span>
                                            )}
                                        </div>
                                    </Label>
                                </div>
                            ))}
                        </RadioGroup>
                    )}
                </div>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => handleOpenChange(false)}
                        disabled={isPending}
                    >
                        {t('accountDialog.cancel')}
                    </Button>
                    <Button
                        onClick={handleConfirm}
                        disabled={!selectedAccountId || isPending}
                    >
                        {isPending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                {t('accountDialog.connecting')}
                            </>
                        ) : (
                            t('accountDialog.connect')
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
