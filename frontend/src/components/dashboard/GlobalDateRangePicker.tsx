import { useDateRange, DateRangeOption } from "@/contexts/DateRangeContext";
import { DATE_RANGE_LABELS } from "@/types/dateRange";

export function GlobalDateRangePicker() {
    const { dateRange, setDateRange, availableOptions } = useDateRange();

    return (
        <div className="bg-slate-100/50 p-0.5 rounded-md flex flex-wrap items-center justify-center gap-1 border border-slate-200/60">
            {availableOptions.map((option) => (
                <button
                    key={option}
                    onClick={() => setDateRange(option as DateRangeOption)}
                    className={`px-3 sm:px-3 py-1.5 text-[12px] sm:text-sm font-medium rounded transition-all duration-200 ${dateRange === option
                        ? 'bg-white text-slate-900 shadow-sm ring-1 ring-black/5'
                        : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200/50'
                        }`}
                >
                    {DATE_RANGE_LABELS[option]}
                </button>
            ))}
        </div>
    );
}
