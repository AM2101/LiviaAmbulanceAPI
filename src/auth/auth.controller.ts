import {
    Controller,
    Post,
    Body,
    ValidationPipe,
    UsePipes,
    HttpCode,
    Patch,
    Request,
    UseGuards,
    Inject,
  } from '@nestjs/common';
  import { AuthService } from './auth.service';
  import {
    ChangePasswordDto,
    CreateResetPasswordLinkDto,
    LoginDto,
    LogoutDto,
    NewTokensDto,
    ResendOtpDto,
    ResetPasswordDto,
    VerifyOtpDto,
  } from './dto/auth.dto';
  import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
  import {
    CHANGE_PASSWORD_OUTPUT,
    CREATE_RESET_PASSWORD_LINK_OUTPUT,
    GENERATE_NEW_TOKENS_OUTPUT,
    LOGIN_OUTPUT,
    LOGOUT_OUTPUT,
    RESET_PASSWORD_OUTPUT,
  } from '../constants/swagger';
  import { AuthGuard } from '../guards/auth.guard';
  import { ClientProxy } from '@nestjs/microservices';
  import { StatusGuard } from '../guards/status.guard';
  import { WriteAccessGuard } from '../guards/write-access.guard';
  
  @ApiTags('Auth')
  @Controller('auth')
  @ApiTags('Auth')
  export class AuthController {
    constructor(
    //   @Inject('RMQ_NOTIFICATION_FORGET_EMAIL')
    //   private rmqNotificationForgetEmail: ClientProxy,
    //   @Inject('RMQ_NOTIFICATION_OTP_EMAIL')
    //   private rmqNotificationOtpEmail: ClientProxy,
    //   @Inject('RMQ_NOTIFICATION_OTP_SMS')
    //   private rmqNotificationOtpSms: ClientProxy,
      private authService: AuthService,
    ) {}
  
    @HttpCode(200)
    @Post('login')
    @UsePipes(ValidationPipe)
    @ApiResponse({
      status: 200,
      description: 'Successful Response',
      content: {
        'application/json': {
          examples: {
            LOGIN_OUTPUT: { value: LOGIN_OUTPUT },
          },
        },
      },
    })
    async login(@Body() loginDto: LoginDto) {
      return await this.authService.login(
        loginDto,
        // this.rmqNotificationOtpEmail,
        // this.rmqNotificationOtpSms,
      );
    }
  
    @HttpCode(200)
    @Post('logout')
    @UsePipes(ValidationPipe)
    @ApiResponse({
      status: 200,
      description: 'Successful Response',
      content: {
        'application/json': {
          examples: {
            LOGOUT_OUTPUT: { value: LOGOUT_OUTPUT },
          },
        },
      },
    })
    async logout(@Body() logoutDto: LogoutDto) {
      return await this.authService.logout(logoutDto);
    }
  
    @HttpCode(200)
    @Post('generateNewTokens')
    @UsePipes(ValidationPipe)
    @ApiResponse({
      status: 200,
      description: 'Successful Response',
      content: {
        'application/json': {
          examples: {
            GENERATE_NEW_TOKENS_OUTPUT: { value: GENERATE_NEW_TOKENS_OUTPUT },
          },
        },
      },
    })
    async generateNewTokensOnRequest(@Body() newTokensDto: NewTokensDto) {
      return await this.authService.generateNewTokensOnRequest(newTokensDto);
    }
  
    @UseGuards(AuthGuard)
    @UseGuards(StatusGuard)
    @UseGuards(WriteAccessGuard)
    @HttpCode(200)
    @Patch('changePassword')
    @UsePipes(ValidationPipe)
    @ApiBearerAuth()
    @ApiResponse({
      status: 200,
      description: 'Successful Response',
      content: {
        'application/json': {
          examples: {
            CHANGE_PASSWORD_OUTPUT: { value: CHANGE_PASSWORD_OUTPUT },
          },
        },
      },
    })
    async changePassword(
      @Body() changePasswordDto: ChangePasswordDto,
      @Request() req,
    ) {
      const accessTokenData = req.accessTokenData;
  
      return await this.authService.changePassword(
        accessTokenData,
        changePasswordDto,
      );
    }
  
    @HttpCode(200)
    @Post('forgotPassword')
    @UsePipes(ValidationPipe)
    @ApiResponse({
      status: 200,
      description: 'Successful Response',
      content: {
        'application/json': {
          examples: {
            CREATE_RESET_PASSWORD_LINK_OUTPUT: {
              value: CREATE_RESET_PASSWORD_LINK_OUTPUT,
            },
          },
        },
      },
    })
    async createResetPasswordLink(
      @Body() createResetPasswordLinkDto: CreateResetPasswordLinkDto,
    ) {
      return await this.authService.createResetPasswordLink(
        createResetPasswordLinkDto.email,
        // this.rmqNotificationForgetEmail,
      );
    }
  
    @HttpCode(200)
    @Patch('resetPassword')
    @UsePipes(ValidationPipe)
    @ApiResponse({
      status: 200,
      description: 'Successful Response',
      content: {
        'application/json': {
          examples: {
            RESET_PASSWORD_OUTPUT: { value: RESET_PASSWORD_OUTPUT },
          },
        },
      },
    })
    async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
      return await this.authService.resetPassword(resetPasswordDto);
    }
  
    @HttpCode(200)
    @Post('resendOTP')
    @UsePipes(ValidationPipe)
    @ApiResponse({
      status: 200,
      description: 'Successful Response',
    })
    async resendOtp(@Body() resendOtpDto: ResendOtpDto) {
      return await this.authService.resendOtp(
        resendOtpDto,
        // this.rmqNotificationOtpEmail,
        // this.rmqNotificationOtpSms,
      );
    }
  
    @HttpCode(200)
    @Post('verifyOTP')
    @UsePipes(ValidationPipe)
    @ApiResponse({
      status: 200,
      description: 'Successful Response',
    })
    async verifyOtp(@Body() verifyOtpDto: VerifyOtpDto) {
      return await this.authService.verifyOtp(verifyOtpDto);
    }
  }
  