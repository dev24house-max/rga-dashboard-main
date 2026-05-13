import { AlertCircle, Loader2, Link, Unlink } from "lucide-react";
import { useIntegrationStatus } from '@/hooks/useIntegrationStatus';

export function BingConnectionStatus() {
    const { status, isLoading, error } = useIntegrationStatus();

    const baseClasses = "inline-flex items-center gap-2.5 px-4 py-2.5 rounded-lg border transition-all duration-200 backdrop-blur-sm";
    const isConnected = status.bingWebmaster === true;

    if (isLoading) {
        return (
            <div className={`${baseClasses} bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200 shadow-sm hover:shadow-md`}>
                <Loader2 className="w-4 h-4 text-amber-600 animate-spin" />
                <span className="text-sm font-semibold text-amber-900 tracking-wide">
                    กำลังตรวจสอบการเชื่อมต่อ Bing Webmaster...
                </span>
            </div>
        );
    }

    if (error) {
        return (
            <div className={`${baseClasses} bg-gradient-to-r from-red-50 to-rose-50 border-red-200 shadow-sm hover:shadow-md`}>
                <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                <span className="text-sm font-semibold text-red-900 tracking-wide">
                    ไม่สามารถตรวจสอบการเชื่อมต่อ Bing Webmaster
                </span>
            </div>
        );
    }

    if (isConnected) {
        return (
            <div className={`${baseClasses} bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 shadow-sm hover:shadow-md`}>
                <Link className="w-4 h-4 text-blue-600 flex-shrink-0" />
                <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-semibold text-blue-900 tracking-wide">
                        เชื่อมต่อ Bing Webmaster แล้ว
                    </span>
                </div>
            </div>
        );
    }

    return (
        <div className={`${baseClasses} bg-gradient-to-r from-slate-50 to-gray-50 border-slate-200 shadow-sm hover:shadow-md`}>
            <Unlink className="w-4 h-4 text-slate-600 flex-shrink-0" />
            <span className="text-sm font-semibold text-slate-900 tracking-wide">
                ยังไม่เชื่อมต่อ Bing Webmaster
            </span>
        </div>
    );
}