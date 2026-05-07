import { Global, Module } from '@nestjs/common';
import { EncryptionService } from './services/encryption.service';
import { MailService } from './services/mail.service';
import { AdsApiLogService } from './services/ads-api-log.service';

@Global()
@Module({
    providers: [EncryptionService, MailService, AdsApiLogService],
    exports: [EncryptionService, MailService, AdsApiLogService],
})
export class CommonModule { }
