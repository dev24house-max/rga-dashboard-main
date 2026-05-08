import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2, Search, ExternalLink } from 'lucide-react';

interface SearchConsoleCardProps {
    isLoading?: boolean;
    connected?: boolean;
    onOpen: () => void;
    isPending?: boolean;
}

export function SearchConsoleCard({
    isLoading = false,
    connected = false,
    onOpen,
    isPending = false,
}: SearchConsoleCardProps) {
    const statusLabel = connected ? 'Connected' : 'Not connected';
    const description = connected
        ? 'Google Search Console is connected. Open the SEO dashboard to review organic search data and sync performance metrics.'
        : 'Sign in with the Google account that has access to your Search Console property.';

    return (
        <Card className="relative overflow-hidden">
            {isLoading ? (
                <>
                    <CardHeader className="pb-3">
                        <div className="flex items-center gap-3">
                            <Skeleton className="h-12 w-12 rounded-lg" />
                            <div className="space-y-2 flex-1">
                                <Skeleton className="h-5 w-32" />
                                <Skeleton className="h-4 w-40" />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-5/6 mt-2" />
                    </CardContent>
                    <CardFooter>
                        <Skeleton className="h-9 w-32" />
                    </CardFooter>
                </>
            ) : (
                <>
                    <CardHeader className="pb-3">
                        <div className="flex items-start sm:items-center justify-between gap-3">
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
                                    <Search className="h-6 w-6" />
                                </div>
                                <div className="min-w-0">
                                    <CardTitle className="text-base sm:text-lg truncate">Google Search Console</CardTitle>
                                    <CardDescription className="text-xs sm:text-sm line-clamp-2">
                                        {description}
                                    </CardDescription>
                                </div>
                            </div>
                            <Badge variant={connected ? 'default' : 'secondary'} className="flex-shrink-0">
                                {statusLabel}
                            </Badge>
                        </div>
                    </CardHeader>

                    <CardFooter className="gap-2">
                        <Button onClick={onOpen} disabled={isPending} className="w-full">
                            {isPending ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <ExternalLink className="mr-2 h-4 w-4" />
                            )}
                            {connected ? 'Open SEO dashboard' : 'Connect with Google'}
                        </Button>
                    </CardFooter>
                </>
            )}
        </Card>
    );
}
