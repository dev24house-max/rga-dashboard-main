import { IsString, IsUrl } from 'class-validator';

export class ConnectGscDto {
    @IsString()
    @IsUrl()
    siteUrl!: string;
}
