import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { AiAssistant } from "../components/ai-assistant";

export function AiInsightsPage() {
    return (
        <DashboardLayout>
            <div className="h-[calc(100vh-48px)] overflow-hidden animate-in fade-in duration-500" data-tutorial="ai-insights-page">
                {/* AI Assistant Section */}
                <AiAssistant />
            </div>
        </DashboardLayout>
    );
}
