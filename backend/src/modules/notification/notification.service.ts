import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../../common/services/mail.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { NotificationQueryDto } from './dto/notification-query.dto';
import { Prisma, NotificationChannel, Notification, Alert } from '@prisma/client';

@Injectable()
export class NotificationService {
    private readonly logger = new Logger(NotificationService.name);

    constructor(
        private readonly prisma: PrismaService,
        private readonly mailService: MailService,
    ) { }

    /**
     * Create a new notification
     */
    async create(tenantId: string, dto: CreateNotificationDto): Promise<Notification> {
        return this.prisma.notification.create({
            data: {
                tenantId,
                userId: dto.userId,
                type: dto.type,
                title: dto.title,
                message: dto.message,
                channel: dto.channel || NotificationChannel.IN_APP,
                priority: dto.priority || 'NORMAL',
                metadata: dto.metadata || null,
                alertId: dto.alertId || null,
                campaignId: dto.campaignId || null,
            },
        });
    }

    /**
     * Trigger notifications from an Alert
     * Creates a notification for each active user in the tenant
     */
    async triggerFromAlert(
        alert: Alert,
        client: Prisma.TransactionClient | PrismaService = this.prisma,
    ): Promise<void> {
        // Get all active users in the tenant
        const users = await client.user.findMany({
            where: { tenantId: alert.tenantId, isActive: true },
            select: { id: true },
        });

        if (users.length === 0) {
            return;
        }

        const alertMetadata =
            alert.metadata &&
                typeof alert.metadata === 'object' &&
                !Array.isArray(alert.metadata)
                ? (alert.metadata as Record<string, unknown>)
                : {};

        // Create notification for each user
        const notifications = users.map((user) => ({
            tenantId: alert.tenantId,
            userId: user.id,
            type: 'ALERT',
            title: alert.title,
            message: alert.message,
            channel: NotificationChannel.IN_APP,
            priority: alert.severity === 'CRITICAL' ? 'HIGH' : 'NORMAL',
            alertId: alert.id,
            metadata: {
                ...alertMetadata,
                alertType: alert.type,
                severity: alert.severity,
                actionUrl: `/dashboard/alerts/${alert.id}`,
                actionText: 'View details',
            },
        }));

        await client.notification.createMany({
            data: notifications,
            skipDuplicates: true,
        });
    }

    /**
     * Create system notification for a specific user
     */
    async sendSystemNotification(
        tenantId: string,
        userId: string,
        title: string,
        message: string,
        metadata?: Record<string, any>,
    ): Promise<Notification> {
        return this.prisma.notification.create({
            data: {
                tenantId,
                userId,
                type: 'SYSTEM',
                title,
                message,
                channel: NotificationChannel.IN_APP,
                priority: 'NORMAL',
                metadata: metadata || null,
            },
        });
    }

    /**
     * Notify when sync is complete
     */
    async notifySyncComplete(
        tenantId: string,
        userId: string,
        platform: string,
        recordsCount: number,
    ): Promise<Notification> {
        return this.prisma.notification.create({
            data: {
                tenantId,
                userId,
                type: 'SYNC_COMPLETE',
                title: `${platform} Sync Complete`,
                message: `Successfully synced ${recordsCount} records from ${platform}.`,
                channel: NotificationChannel.IN_APP,
                priority: 'LOW',
                metadata: {
                    platform,
                    recordsCount,
                    actionUrl: '/dashboard',
                    actionText: 'View Dashboard',
                },
            },
        });
    }

    /**
     * Send email alert when budget is running low
     * Triggers for Budget Running Low (80%) and Budget Nearly Exhausted (90%)
     */
    async sendBudgetAlertEmail(
        alert: Alert & { campaign?: { name: string } | null },
        userEmails: string[],
    ): Promise<void> {
        const campaignName = alert.campaign?.name || 'Unknown Campaign';
        const isCritical = alert.severity === 'CRITICAL';
        const alertType = isCritical ? 'Budget Nearly Exhausted (90%)' : 'Budget Running Low (80%)';
        const backgroundColor = isCritical ? '#dc2626' : '#f59e0b';
        const buttonColor = isCritical ? '#991b1b' : '#b45309';

        for (const email of userEmails) {
            try {
                const htmlContent = `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <div style="background-color: ${backgroundColor}; color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                            <h2 style="margin: 0; font-size: 24px;">${alertType}</h2>
                            <p style="margin: 10px 0 0 0; font-size: 16px;">Campaign: <strong>${campaignName}</strong></p>
                        </div>

                        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                            <p style="margin: 0 0 15px 0; color: #1f2937;">
                                ${alert.message}
                            </p>
                            <p style="margin: 0; color: #4b5563; font-size: 14px;">
                                <strong>Alert Type:</strong> ${alert.type}<br/>
                                <strong>Severity:</strong> ${alert.severity}<br/>
                                <strong>Time:</strong> ${new Date().toLocaleString()}
                            </p>
                        </div>

                        <div style="text-align: center; margin-bottom: 20px;">
                            <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/dashboard/alerts/${alert.id}" 
                               style="background-color: ${buttonColor}; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">
                                View Alert Details
                            </a>
                        </div>

                        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">

                        <p style="color: #6b7280; font-size: 12px; margin: 0;">
                            This is an automated alert from RGA Dashboard. Please do not reply to this email.
                        </p>
                    </div>
                `;

                await this.mailService.sendMail({
                    to: email,
                    subject: `[${alert.severity}] ${alertType} - ${campaignName}`,
                    html: htmlContent,
                });

                this.logger.log(`Budget alert email sent to ${email} for campaign ${campaignName}`);
            } catch (error) {
                this.logger.error(`Failed to send budget alert email to ${email}:`, error);
                // Don't throw - continue sending to other users
            }
        }
    }

    /**
     * Get notifications for a user with pagination
     */
    async findAll(userId: string, query: NotificationQueryDto) {
        const { page = 1, limit = 20, isRead, type } = query;
        const skip = (page - 1) * limit;

        const where: any = {
            userId,
            isDismissed: false,
        };

        if (isRead !== undefined) {
            where.isRead = isRead;
        }
        if (type) {
            where.type = type;
        }

        const [data, total] = await Promise.all([
            this.prisma.notification.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
                select: {
                    id: true,
                    type: true,
                    title: true,
                    message: true,
                    channel: true,
                    priority: true,
                    metadata: true,
                    isRead: true,
                    readAt: true,
                    createdAt: true,
                    alertId: true,
                    campaignId: true,
                },
            }),
            this.prisma.notification.count({ where }),
        ]);

        return {
            data,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    /**
     * Get unread count for a user
     */
    async getUnreadCount(userId: string): Promise<number> {
        return this.prisma.notification.count({
            where: { userId, isRead: false, isDismissed: false },
        });
    }

    /**
     * Mark notification as read
     */
    async markAsRead(id: string, userId: string): Promise<Notification> {
        const notification = await this.prisma.notification.findFirst({
            where: { id, userId },
        });

        if (!notification) {
            throw new NotFoundException('Notification not found');
        }

        return this.prisma.notification.update({
            where: { id },
            data: { isRead: true, readAt: new Date() },
        });
    }

    /**
     * Mark all notifications as read for a user
     */
    async markAllAsRead(userId: string): Promise<{ count: number }> {
        const result = await this.prisma.notification.updateMany({
            where: { userId, isRead: false },
            data: { isRead: true, readAt: new Date() },
        });

        return { count: result.count };
    }

    /**
     * Dismiss a notification (soft delete)
     */
    async dismiss(id: string, userId: string): Promise<Notification> {
        const notification = await this.prisma.notification.findFirst({
            where: { id, userId },
        });

        if (!notification) {
            throw new NotFoundException('Notification not found');
        }

        return this.prisma.notification.update({
            where: { id },
            data: { isDismissed: true },
        });
    }

    /**
     * Delete old notifications (for cleanup jobs)
     */
    async deleteOldNotifications(daysOld: number = 30): Promise<{ count: number }> {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - daysOld);

        const result = await this.prisma.notification.deleteMany({
            where: {
                createdAt: { lt: cutoffDate },
                isDismissed: true,
            },
        });

        return { count: result.count };
    }
}
