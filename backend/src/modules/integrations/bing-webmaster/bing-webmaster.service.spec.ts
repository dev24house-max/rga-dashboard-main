import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { PrismaModule } from '../../prisma/prisma.module';
import { BingWebmasterService } from './bing-webmaster.service';

describe('BingWebmasterService', () => {
    let service: BingWebmasterService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [ConfigModule, HttpModule, PrismaModule],
            providers: [BingWebmasterService],
        }).compile();

        service = module.get<BingWebmasterService>(BingWebmasterService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should get API key', () => {
        const apiKey = (service as any).getApiKey();
        expect(apiKey).toBeDefined();
        expect(typeof apiKey).toBe('string');
    });
});