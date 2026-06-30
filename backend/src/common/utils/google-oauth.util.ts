import { ConfigService } from '@nestjs/config';

/**
 * Resolve Google OAuth redirect URI.
 * Prefers explicit env var; falls back to FRONTEND_URL + callback path.
 */
export function resolveGoogleOAuthRedirectUri(
    configService: ConfigService,
    envKey: string,
    callbackPath: string,
): string {
    const explicit = configService.get<string>(envKey);
    if (explicit) {
        return explicit.replace(/\/$/, '');
    }

    const frontendUrl = (
        configService.get<string>('FRONTEND_URL') || 'http://localhost:5173'
    ).replace(/\/$/, '');

    return `${frontendUrl}${callbackPath}`;
}
