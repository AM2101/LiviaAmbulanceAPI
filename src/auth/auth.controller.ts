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
  Get,
  OnModuleInit,
  Param,
  NotFoundException,
  Put,
  Delete,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  AccessDto,
  ChangePasswordDto,
  CountryDto,
  CreateResetPasswordLinkDto,
  CreateRoleDto,
  LoginDto,
  LogoutDto,
  ModuleandAccessDto,
  ModuleDto,
  NewTokensDto,
  ResendOtpDto,
  ResetPasswordDto,
  RoleDto,
  UpdateAccessDto,
  UpdateRoleAccessDto,
  VerifyOtpDto,
} from './dto/auth.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
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
import { ReadAccessGuard } from 'src/guards/read-access.guard';
import { CommonService } from 'src/common/common.service';

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
    private commonService: CommonService,
  ) {
    // this.commonService.controllerReadAccess('AuthController')
  }
  // onModuleInit() {
  //   this.commonService.controllerReadAccess('MANAGE_USERS', null);
  // }
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
  // @UseGuards(WriteAccessGuard)
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

  @UseGuards(AuthGuard)
  @UseGuards(StatusGuard)
  @UseGuards(ReadAccessGuard)
  @ApiBearerAuth()
  @Get('getroles')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Successful response',
    type: [RoleDto],
  })
  async getroles() {
    return await this.authService.getRoles();
  }

  @UseGuards(AuthGuard)
  @UseGuards(StatusGuard)
  @UseGuards(ReadAccessGuard)
  @ApiBearerAuth()
  @Get('getphonecodes')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Successful response',
    type: [CountryDto],
  })
  async getcountries() {
    return await this.authService.getcountries();
  }

  @UseGuards(AuthGuard)
  @UseGuards(StatusGuard)
  @UseGuards(ReadAccessGuard)
  @ApiBearerAuth()
  @Get('getmodules')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Successful response',
    type: [ModuleDto],
  })
  async getmodules() {
    return await this.authService.getmodules();
  }


  @UseGuards(AuthGuard)
  @UseGuards(StatusGuard)
  @UseGuards(ReadAccessGuard)
  @ApiBearerAuth()
  @Get('getaccessbyrole/:roleId')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Successful response',
    type: [AccessDto],
  })
  @ApiOperation({ summary: 'Get access details by roleId' })
  getModulesAndAccess(@Param('roleId') roleId: string) {
    return this.authService.getAccessByRoleId(roleId);
  }

  @UseGuards(AuthGuard)
  @UseGuards(StatusGuard)
  @UseGuards(ReadAccessGuard)
  @ApiBearerAuth()
  @Post('createrole')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Successful response',
    type: RoleDto,
  })
  @ApiOperation({ summary: 'Create a new role' })
  async createRole(@Body() createRoleDto: CreateRoleDto) {
    return this.authService.createRole(createRoleDto);
  }

  @UseGuards(AuthGuard)
  @UseGuards(StatusGuard)
  @UseGuards(ReadAccessGuard)
  @ApiBearerAuth()
  @Delete('deleterole/:id')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Role deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Role not found',
  })
  @ApiOperation({ summary: 'Delete a role by ID' })
  async deleteRole(@Param('id') id: string) {
    const result = await this.authService.deleteRole(id);

    if (!result) {
      return { statusCode: 404, message: 'Role not found' };
    }

    return { statusCode: 200, message: 'Role deleted successfully' };
  }



  @UseGuards(AuthGuard)
  @UseGuards(StatusGuard)
  @UseGuards(ReadAccessGuard)
  @ApiBearerAuth()
  @Put('updateaccess')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Successful response',
    type: RoleDto,
  })
  @ApiOperation({ summary: 'Update access details' })
  async updateAccess(@Body() updateAccessDto: UpdateAccessDto) {
    console.log('updateAccessDto', updateAccessDto);

    return this.authService.updateAccess(updateAccessDto);
  }


  @UseGuards(AuthGuard)
  @UseGuards(StatusGuard)
  @UseGuards(ReadAccessGuard)
  @ApiBearerAuth()
  @Get('test')
  @HttpCode(200)
  async test() {
    return 'Hello World!';
  }

}
