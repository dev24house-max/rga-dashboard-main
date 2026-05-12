import { IsUrl } from 'class-validator';

export class ConnectBingDto {
    @IsUrl()
    siteUrl: string;
}