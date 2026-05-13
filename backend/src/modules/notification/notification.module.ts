import { Module } from '@nestjs/common';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { PrismaModule } from '../prisma/prisma.module';
import { MailService } from '../../common/services/mail.service';

@Module({
    imports: [PrismaModule],
    controllers: [NotificationController],
    providers: [NotificationService, MailService],
    exports: [NotificationService],
})
export class NotificationModule { }
