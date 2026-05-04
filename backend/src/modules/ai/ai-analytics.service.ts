import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class AiAnalyticsService {
    private readonly logger = new Logger(AiAnalyticsService.name);

    constructor(private readonly prisma: PrismaService) { }

    // 📊 Collect User Behavior Data
    async collectUserBehavior(tenantId: string, userId: string, action: string, data: any) {
        try {
            await this.prisma.userBehavior.create({
                data: {
                    tenantId,
                    userId,
                    action,
                    data,
                    timestamp: new Date(),
                }
            });
        } catch (error) {
            this.logger.error(`Failed to collect user behavior: ${error.message}`);
        }
    }

    // 📈 Track Business Metrics
    async trackBusinessMetrics(tenantId: string, metrics: any) {
        try {
            await this.prisma.businessMetric.create({
                data: {
                    tenantId,
                    metrics,
                    timestamp: new Date(),
                }
            });

            await this.triggerInsightsWhenMetricsChange(tenantId, metrics);
        } catch (error) {
            this.logger.error(`Failed to track business metrics: ${error.message}`);
        }
    }

    // 🔍 Generate AI Insights
    async generateInsights(tenantId: string, type: string) {
        try {
            const insights = await this.prisma.aiInsight.create({
                data: {
                    tenantId,
                    type,
                    source: 'ai-analytics',
                    title: `AI Generated Insight - ${type}`,
                    message: `Automated insight for ${type} analysis`,
                    payload: {
                        generatedAt: new Date(),
                        confidence: 0.85,
                        recommendations: []
                    },
                    status: 'ACTIVE'
                }
            });
            return insights;
        } catch (error) {
            this.logger.error(`Failed to generate insights: ${error.message}`);
        }
    }

    // 📊 Get Analytics Dashboard Data
    async getAnalyticsDashboard(tenantId: string, period: string = '30d') {
        try {
            const [userBehavior, businessMetrics, aiInsights] = await Promise.all([
                this.getUserBehaviorStats(tenantId, period),
                this.getBusinessMetricsStats(tenantId, period),
                this.getAiInsightsStats(tenantId, period)
            ]);

            return {
                userBehavior,
                businessMetrics,
                aiInsights,
                period,
                generatedAt: new Date()
            };
        } catch (error) {
            this.logger.error(`Failed to get analytics dashboard: ${error.message}`);
            return null;
        }
    }

    // 🔄 Daily Analytics Processing
    @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
    @Cron(CronExpression.EVERY_10_MINUTES)
    async processScheduledAnalytics() {
        this.logger.log('Processing AI summary every 10 minutes...');

        const tenants = await this.prisma.tenant.findMany({
            select: { id: true }
        });

        for (const tenant of tenants) {
            try {
                await this.generateScheduledInsights(tenant.id);
            } catch (error) {
                this.logger.error(`Failed to process scheduled analytics for tenant ${tenant.id}: ${error.message}`);
            }
        }
    }

    @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
    async processDailyAnalytics() {
        this.logger.log('Processing daily analytics...');

        const tenants = await this.prisma.tenant.findMany({
            select: { id: true }
        });

        for (const tenant of tenants) {
            try {
                await this.generateDailyInsights(tenant.id);
                await this.aggregateDailyMetrics(tenant.id);
            } catch (error) {
                this.logger.error(`Failed to process analytics for tenant ${tenant.id}: ${error.message}`);
            }
        }
    }

    private async getUserBehaviorStats(tenantId: string, period: string) {
        // Implementation for user behavior statistics
        return {
            totalSessions: 0,
            averageSessionDuration: 0,
            topActions: [],
            uniqueUsers: 0
        };
    }

    private async getBusinessMetricsStats(tenantId: string, period: string) {
        // Implementation for business metrics statistics
        return {
            totalRevenue: 0,
            conversionRate: 0,
            campaignPerformance: [],
            customerSegments: []
        };
    }

    private async getAiInsightsStats(tenantId: string, period: string) {
        // Implementation for AI insights statistics
        return {
            totalInsights: 0,
            activeInsights: 0,
            insightsByType: {},
            recentInsights: []
        };
    }

    private async generateScheduledInsights(tenantId: string) {
        // Generate insights more frequently for update-driven summaries
        await this.generateInsights(tenantId, 'scheduled-summary');
    }

    private async generateDailyInsights(tenantId: string) {
        // Generate daily AI insights based on data patterns
        await this.generateInsights(tenantId, 'daily-summary');
    }

    private async aggregateDailyMetrics(tenantId: string) {
        // Aggregate daily metrics for reporting
        // Implementation here
    }

    private async triggerInsightsWhenMetricsChange(tenantId: string, metrics: any) {
        try {
            const previousMetric = await this.prisma.businessMetric.findFirst({
                where: { tenantId },
                orderBy: { timestamp: 'desc' },
                skip: 1,
            });

            const shouldGenerate = !previousMetric || this.haveMetricsChanged(previousMetric.metrics, metrics);
            if (shouldGenerate) {
                this.logger.log(`Business metrics changed for tenant ${tenantId}, generating AI insights...`);
                await this.generateInsights(tenantId, 'metrics-change');
            }
        } catch (error) {
            this.logger.error(`Failed to trigger insights on metric change: ${error.message}`);
        }
    }

    private haveMetricsChanged(previous: any, current: any): boolean {
        return JSON.stringify(this.normalizeJson(previous)) !== JSON.stringify(this.normalizeJson(current));
    }

    private normalizeJson(value: any): any {
        if (Array.isArray(value)) {
            return value.map((item) => this.normalizeJson(item));
        }

        if (value && typeof value === 'object') {
            return Object.keys(value).sort().reduce((result, key) => {
                result[key] = this.normalizeJson(value[key]);
                return result;
            }, {} as any);
        }

        return value;
    }
}
