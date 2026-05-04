import { Injectable, Logger } from '@nestjs/common';
import { promises as fs } from 'fs';
import { dirname, join, sep } from 'path';

@Injectable()
export class AdsApiLogService {
    private readonly logger = new Logger(AdsApiLogService.name);
    private readonly logFilePath: string;

    constructor() {
        const cwd = process.cwd();
        const backendRoot = cwd.endsWith(`${sep}backend`) ? cwd : join(cwd, 'backend');
        this.logFilePath = join(backendRoot, 'logs', 'ads-api.log');
    }

    async write(platform: string, message: string, data?: any) {
        const body = this.formatEntry(platform, message, data);
        await this.ensureLogDirectory();
        await fs.appendFile(this.logFilePath, body, { encoding: 'utf8' });
        this.logger.log(`[${platform}] ${message}`);
    }

    async info(platform: string, message: string, data?: any) {
        await this.write(platform, message, data);
    }

    async warn(platform: string, message: string, data?: any) {
        await this.write(platform, `WARN: ${message}`, data);
    }

    async error(platform: string, message: string, error?: any, data?: any) {
        const combined = { ...(data || {}), error: this.formatError(error) };
        await this.write(platform, `ERROR: ${message}`, combined);
    }

    private formatEntry(platform: string, message: string, data?: any): string {
        const timestamp = new Date().toISOString();
        const payload = data !== undefined ? ` ${this.safeStringify(data)}` : '';
        return `${timestamp} [${platform}] ${message}${payload}\n`;
    }

    private safeStringify(value: any): string {
        try {
            return JSON.stringify(value, null, 2);
        } catch {
            return String(value);
        }
    }

    private formatError(error: any): any {
        if (!error) return null;
        if (error instanceof Error) {
            return { message: error.message, stack: error.stack };
        }
        return error;
    }

    private async ensureLogDirectory() {
        const dir = dirname(this.logFilePath);
        await fs.mkdir(dir, { recursive: true });
    }
}
