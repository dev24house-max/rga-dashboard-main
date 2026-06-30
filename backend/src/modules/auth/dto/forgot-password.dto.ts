import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, Matches } from 'class-validator';

export class ForgotPasswordDto {
  @ApiProperty({ 
    example: 'admin@rga.com',
    description: 'User email address for password reset'
  })
  @IsEmail()
  email: string;
}

export class ResetPasswordDto {
  @ApiProperty({ 
    example: 'abcd1234efgh5678',
    description: 'Password reset token from email'
  })
  @IsString()
  token: string;

  @ApiProperty({ 
    example: 'NewSecurePassword123!',
    description: 'New password (min 8 characters, must include uppercase, lowercase, number, and special character)'
  })
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Matches(/[a-z]/, { message: 'Password must contain at least one lowercase letter' })
  @Matches(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
  @Matches(/[0-9]/, { message: 'Password must contain at least one number' })
  @Matches(/[^A-Za-z0-9]/, { message: 'Password must contain at least one special character' })
  newPassword: string;
}
