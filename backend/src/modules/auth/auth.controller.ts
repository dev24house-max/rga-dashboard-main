import { Controller, Post, Body, Req, HttpCode, HttpStatus, Get, Query, Res, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto, ForgotPasswordDto, ResetPasswordDto } from './dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) { }

  @Post('register')
  @ApiOperation({ summary: 'Register new tenant and admin user' })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)  // ✅ Contract: Login returns 200 OK (not 201)
  @ApiOperation({ summary: 'Login with brute force protection' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  login(@Body() dto: LoginDto, @Req() request: Request) {
    return this.authService.login(dto, request);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)  // ✅ Contract: Refresh returns 200 OK (not 201)
  @ApiOperation({ summary: 'Refresh Access Token' })
  @ApiResponse({ status: 200, description: 'Token refreshed successfully' })
  refresh(@Body() body: { refreshToken: string }, @Req() request: Request) {
    return this.authService.refreshToken(body.refreshToken, request);
  }

  @Get('verify-email')
  @ApiOperation({ summary: 'Verify email with token' })
  @ApiResponse({ status: 200, description: 'Email verified successfully' })
  verifyEmail(@Query('token') token: string) {
    return this.authService.verifyEmail(token);
  }

  @Get('google/url')
  @ApiOperation({ summary: 'Redirect to Google login' })
  async getGoogleLoginUrl(@Res() res: Response) {
    const authUrl = await this.authService.getGoogleAuthUrl();
    return res.redirect(authUrl);
  }

  @Get('google/callback')
  @ApiOperation({ summary: 'Google OAuth callback' })
  async handleGoogleCallback(
    @Query('code') code: string,
    @Req() request: Request,
    @Res() res: Response,
  ) {
    const result = await this.authService.handleGoogleLoginCallback(code, request);
    const frontendUrl = (this.configService.get<string>('FRONTEND_URL') || 'http://localhost:5173').replace(/\/$/, '');
    const redirectUrl = `${frontendUrl}/google-login-callback#accessToken=${encodeURIComponent(result.accessToken)}&refreshToken=${encodeURIComponent(result.refreshToken)}`;
    return res.redirect(redirectUrl);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  @ApiOperation({ summary: 'Get current authenticated user' })
  getCurrentUser(@CurrentUser() user: any) {
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      tenant: user.tenant,
    };
  }

  @Get('test-mail')
  @ApiOperation({ summary: 'INTERNAL DEBUG: Test SMTP' })
  testMail(@Query('to') to: string) {
    return this.authService.debugTestMail(to);
  }

  @Get('debug-config')
  @ApiOperation({ summary: 'INTERNAL DEBUG: Check environment variables' })
  debugConfig() {
    return this.authService.debugConfig();
  }

  @Post('resend-verification')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Resend email verification' })
  @ApiResponse({ status: 200, description: 'Verification email sent' })
  resendVerification(@Body() body: { email: string }) {
    return this.authService.resendVerificationEmail(body.email);
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Request password reset' })
  @ApiResponse({ status: 200, description: 'Password reset email sent' })
  forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto);
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reset password with token' })
  @ApiResponse({ status: 200, description: 'Password reset successfully' })
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto);
  }
}
