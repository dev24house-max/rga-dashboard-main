import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { PrismaModule } from '../../prisma/prisma.module';
import { BingWebmasterService } from './bing-webmaster.service';

@Module({
    imports: [PrismaModule, ConfigModule, HttpModule],
    providers: [BingWebmasterService],
    exports: [BingWebmasterService],
})
export class BingWebmasterModule { }