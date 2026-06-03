import { Injectable, Logger, forwardRef, Inject } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationService } from '../notification/notification.service';
import { Prisma, Alert, AlertRuleType, AlertSeverity, AlertStatus } from '@prisma/client';
import { visibleAlertWhere } from '../../common/filters/visible-alerts.filter';

type AlertCheckClient = Prisma.TransactionClient | PrismaService;
type BudgetEmailJob = {
    alert: Alert;
    campaignName: string;
    userEmails: string[];
};

const ALERT_DEDUP_WINDOW_MS = 60 * 60 * 1000;

// Preset Alert Rules - using Prisma enum types
const PRESET_RULES: Array<{
    name: string;
    type: AlertRuleType;
    metric: string;
    operator: string;
    threshold: number;
    severity: AlertSeverity;
    description: string;
}> = [
        {
            name: 'Low ROAS',
            type: AlertRuleType.PRESET,
            metric: 'roas',
            operator: 'lt',
            threshold: 1.0,
            severity: AlertSeverity.WARNING,
            description: 'ROAS ต่ำกว่า 1.0 - กำลังขาดทุน',
        },
        {
            name: 'Critical ROAS',
            type: AlertRuleType.PRESET,
            metric: 'roas',
            operator: 'lt',
            threshold: 0.5,
            severity: AlertSeverity.CRITICAL,
            description: 'ROAS ต่ำกว่า 0.5 - ขาดทุนหนัก',
        },
        {
            name: 'Budget Running Low',
            type: AlertRuleType.PRESET,
            metric: 'spend',
            operator: 'gte',
            threshold: 0.8,
            severity: AlertSeverity.WARNING,
            description: 'ใช้งบไปแล้ว 80% ของ budget',
        },
        {
            name: 'Budget Nearly Exhausted',
            type: AlertRuleType.PRESET,
            metric: 'spend',
            operator: 'gte',
            threshold: 0.9,
            severity: AlertSeverity.CRITICAL,
            description: 'ใช้งบไปแล้ว 90% ของ budget',
        },
        {
            name: 'Overspend',
            type: AlertRuleType.PRESET,
            metric: 'spend',
            operator: 'gt',
            threshold: 1.1,
            severity: AlertSeverity.WARNING,
            description: 'ใช้งบเกิน 110% ของ budget',
        },
        {
            name: 'No Conversions',
            type: AlertRuleType.PRESET,
            metric: 'conversions',
            operator: 'eq',
            threshold: 0,
            severity: AlertSeverity.CRITICAL,
            description: 'ไม่มี Conversion ใน 7 วัน',
        },
        {
            name: 'CTR Drop',
            type: AlertRuleType.PRESET,
            metric: 'ctr',
            operator: 'lt',
            threshold: 0.7,
            severity: AlertSeverity.WARNING,
            description: 'CTR ลดลง 30% จากสัปดาห์ก่อน',
        },
        {
            name: 'Inactive Campaign',
            type: AlertRuleType.PRESET,
            metric: 'impressions',
            operator: 'eq',
            threshold: 0,
            severity: AlertSeverity.INFO,
            description: 'ไม่มี Impressions ใน 3 วัน',
        },
    ];

@Injectable()
export class AlertService {
    private readonly logger = new Logger(AlertService.name);

    constructor(
        private readonly prisma: PrismaService,
        @Inject(forwardRef(() => NotificationService))
        private readonly notificationService: NotificationService,
    ) { }

    // ============================================
    // Alert Rule Management
    // ============================================

    async getRules(tenantId: string) {
        return this.prisma.alertRule.findMany({
            where: { tenantId },
            orderBy: { createdAt: 'desc' },
        });
    }

    async initializePresetRules(tenantId: string) {
        const existingRules = await this.prisma.alertRule.findMany({
            where: { tenantId, alertType: AlertRuleType.PRESET },
        });

        if (existingRules.length > 0) {
            this.logger.log(`Preset rules already exist for tenant ${tenantId}`);
            return existingRules;
        }

        const createdRules = await Promise.all(
            PRESET_RULES.map((rule) =>
                this.prisma.alertRule.create({
                    data: {
                        tenant: { connect: { id: tenantId } },
                        name: rule.name,
                        alertType: rule.type,  // Schema V2 uses alertType
                        metric: rule.metric,
                        operator: rule.operator,
                        threshold: rule.threshold,
                        severity: rule.severity,
                        description: rule.description,
                    },
                }),
            ),
        );

        this.logger.log(`Created ${createdRules.length} preset rules for tenant ${tenantId}`);
        return createdRules;
    }

    async createRule(tenantId: string, data: {
        name: string;
        metric: string;
        operator: string;
        threshold: number;
        severity?: AlertSeverity;
        description?: string;
    }) {
        return this.prisma.alertRule.create({
            data: {
                tenant: { connect: { id: tenantId } },
                name: data.name,
                metric: data.metric,
                operator: data.operator,
                threshold: data.threshold,
                alertType: AlertRuleType.CUSTOM,  // Schema V2 uses alertType
                severity: data.severity || AlertSeverity.WARNING,
                description: data.description,
            },
        });
    }

    async updateRule(ruleId: string, tenantId: string, data: Prisma.AlertRuleUpdateInput) {
        return this.prisma.alertRule.update({
            where: { id: ruleId },
            data,
        });
    }

    async toggleRule(ruleId: string, tenantId: string) {
        const rule = await this.prisma.alertRule.findFirst({
            where: { id: ruleId, tenantId },
        });

        if (!rule) {
            throw new Error('Rule not found');
        }

        return this.prisma.alertRule.update({
            where: { id: ruleId },
            data: { isActive: !rule.isActive },
        });
    }

    async deleteRule(ruleId: string, tenantId: string) {
        const rule = await this.prisma.alertRule.findFirst({
            where: { id: ruleId, tenantId },
        });

        if (!rule) {
            throw new Error('Rule not found');
        }

        if (rule.alertType === AlertRuleType.PRESET) {
            throw new Error('Cannot delete preset rules, only disable them');
        }

        return this.prisma.alertRule.delete({
            where: { id: ruleId },
        });
    }

    // ============================================
    // Alert Management
    // ============================================

    async getAlerts(tenantId: string, options?: {
        status?: AlertStatus;
        severity?: AlertSeverity;
        limit?: number;
    }) {
        const { status, severity, limit = 50 } = options || {};

        const whereClause: Prisma.AlertWhereInput = {
            AND: [{ tenantId }, visibleAlertWhere()],
        };
        if (status) whereClause.status = status;
        if (severity) whereClause.severity = severity;

        return this.prisma.alert.findMany({
            where: whereClause,
            include: {
                campaign: {
                    select: { id: true, name: true, platform: true },
                },
                rule: {
                    select: { id: true, name: true },
                },
            },
            orderBy: { createdAt: 'desc' },
            take: limit,
        });
    }

    async getOpenAlertsCount(tenantId: string) {
        const counts = await this.prisma.alert.groupBy({
            by: ['severity'],
            where: {
                AND: [
                    { tenantId, status: AlertStatus.OPEN },
                    visibleAlertWhere(),
                ],
            },
            _count: true,
        });

        return {
            total: counts.reduce((sum, c) => sum + c._count, 0),
            critical: counts.find((c) => c.severity === AlertSeverity.CRITICAL)?._count || 0,
            warning: counts.find((c) => c.severity === AlertSeverity.WARNING)?._count || 0,
            info: counts.find((c) => c.severity === AlertSeverity.INFO)?._count || 0,
        };
    }

    async acknowledgeAlert(alertId: string, tenantId: string) {
        return this.prisma.alert.update({
            where: { id: alertId },
            data: { status: AlertStatus.ACKNOWLEDGED },
        });
    }

    async resolveAlert(alertId: string, tenantId: string) {
        return this.prisma.alert.update({
            where: { id: alertId },
            data: {
                status: AlertStatus.RESOLVED,
                resolvedAt: new Date(),
            },
        });
    }

    async resolveAllAlerts(tenantId: string) {
        return this.prisma.alert.updateMany({
            where: {
                tenantId,
                status: { not: AlertStatus.RESOLVED },
            },
            data: {
                status: AlertStatus.RESOLVED,
                resolvedAt: new Date(),
            },
        });
    }

    // ============================================
    // Alert Checking (Batch / On-Demand)
    // ============================================

    async checkAlerts(tenantId: string) {
        const result = await this.withTenantAlertLock(tenantId, (client) =>
            this.checkAlertsLocked(client, tenantId),
        );

        for (const emailJob of result.emailJobs) {
            await this.notificationService.sendBudgetAlertEmail(
                { ...emailJob.alert, campaign: { name: emailJob.campaignName } },
                emailJob.userEmails,
            ).catch(err => {
                this.logger.error(`Failed to send budget alert emails: ${err.message}`);
            });
        }

        this.logger.log(`Created ${result.alerts.length} new alerts`);
        return result.alerts;
    }

    private async withTenantAlertLock<T>(
        tenantId: string,
        work: (client: AlertCheckClient) => Promise<T>,
    ): Promise<T> {
        const prismaWithTransaction = this.prisma as PrismaService & {
            $transaction?: PrismaService['$transaction'];
        };

        if (typeof prismaWithTransaction.$transaction !== 'function') {
            return work(this.prisma);
        }

        return this.prisma.$transaction(
            async (tx) => {
                // Serializes alert checks for the same tenant across Node processes.
                await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtext(${`alert-check:${tenantId}`}))`;
                return work(tx);
            },
            { maxWait: 15000, timeout: 60000 },
        );
    }

    private async checkAlertsLocked(client: AlertCheckClient, tenantId: string) {
        this.logger.log(`Checking alerts for tenant ${tenantId}`);

        const rules = await client.alertRule.findMany({
            where: { tenantId, isActive: true },
        });

        if (rules.length === 0) {
            this.logger.log('No active rules found');
            return { alerts: [], emailJobs: [] };
        }

        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const campaigns = await client.campaign.findMany({
            where: { tenantId },
            include: {
                metrics: {
                    where: { date: { gte: sevenDaysAgo }, isMockData: false },
                },
            },
        });

        const dedupCutoff = new Date(Date.now() - ALERT_DEDUP_WINDOW_MS);
        const newAlerts: Alert[] = [];
        const emailJobs: BudgetEmailJob[] = [];

        for (const campaign of campaigns) {
            if (campaign.metrics.length === 0) continue;

            const aggregated = this.aggregateMetrics(campaign.metrics);

            for (const rule of rules) {
                // Convert Decimal budget to number for comparison
                const budgetNum = Number(campaign.budget ?? 0);
                const violated = this.checkRule(rule, aggregated, budgetNum);

                if (violated) {
                    const existingAlert = await client.alert.findFirst({
                        where: {
                            tenantId,
                            campaignId: campaign.id,
                            ruleId: rule.id,
                            OR: [
                                { status: { not: AlertStatus.RESOLVED } },
                                { createdAt: { gte: dedupCutoff } },
                            ],
                        },
                    });

                    if (!existingAlert) {
                        const alert = await client.alert.create({
                            data: {
                                tenant: { connect: { id: tenantId } },
                                rule: { connect: { id: rule.id } },
                                campaign: { connect: { id: campaign.id } },
                                type: rule.name.toUpperCase().replace(/ /g, '_'),
                                severity: rule.severity,
                                title: `${rule.name}: ${campaign.name}`,
                                message: this.generateAlertMessage(rule, aggregated, campaign.name),
                                metadata: {
                                    ruleName: rule.name,
                                    campaignName: campaign.name,
                                    dataSource: 'real',
                                    metricWindowDays: 7,
                                    metric: rule.metric,
                                    value: aggregated[rule.metric],
                                    threshold: rule.threshold,
                                    operator: rule.operator,
                                },
                            },
                        });

                        // 🔔 Trigger notifications for all tenant users
                        await this.notificationService.triggerFromAlert(alert, client);

                        await client.alertRule.update({
                            where: { id: rule.id },
                            data: {
                                lastTriggeredAt: new Date(),
                                triggerCount: { increment: 1 },
                            },
                        });

                        // 📧 Send email notifications for budget alerts
                        if (rule.name.includes('Budget')) {
                            const users = await client.user.findMany({
                                where: { tenantId, isActive: true },
                                select: { email: true },
                            });
                            const userEmails = users.map(u => u.email);
                            if (userEmails.length > 0) {
                                emailJobs.push({
                                    alert,
                                    campaignName: campaign.name,
                                    userEmails,
                                });
                            }
                        }

                        newAlerts.push(alert);
                    }
                }
            }
        }

        return { alerts: newAlerts, emailJobs };
    }

    private aggregateMetrics(metrics: any[]) {
        const totals = metrics.reduce(
            (acc, m) => ({
                impressions: acc.impressions + m.impressions,
                clicks: acc.clicks + m.clicks,
                spend: acc.spend + m.spend,
                conversions: acc.conversions + m.conversions,
                revenue: acc.revenue + m.revenue,
            }),
            { impressions: 0, clicks: 0, spend: 0, conversions: 0, revenue: 0 },
        );

        return {
            ...totals,
            ctr: totals.impressions > 0 ? (totals.clicks / totals.impressions) * 100 : 0,
            cpc: totals.clicks > 0 ? totals.spend / totals.clicks : 0,
            roas: totals.spend > 0 ? totals.revenue / totals.spend : 0,
        };
    }

    private checkRule(rule: any, metrics: any, budget?: number | null) {
        const value = metrics[rule.metric];
        let threshold = Number(rule.threshold);

        if (
            rule.alertType === AlertRuleType.PRESET &&
            rule.metric === 'spend' &&
            budget &&
            threshold <= 1.1
        ) {
            threshold = budget * threshold;
        }

        switch (rule.operator) {
            case 'gt':
                return value > threshold;
            case 'lt':
                return value < threshold;
            case 'eq':
                return value === threshold;
            case 'gte':
                return value >= threshold;
            case 'lte':
                return value <= threshold;
            default:
                return false;
        }
    }

    private generateAlertMessage(rule: any, metrics: any, campaignName: string) {
        const value = metrics[rule.metric];
        const formatted = typeof value === 'number' ? value.toFixed(2) : value;

        return `Campaign "${campaignName}" has ${rule.metric} = ${formatted} (condition: ${rule.operator} ${rule.threshold})`;
    }
}
