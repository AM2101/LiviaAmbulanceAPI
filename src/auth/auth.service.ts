import {
    Injectable,
    UnauthorizedException,
    NotFoundException,
    InternalServerErrorException,
    ForbiddenException,
    BadRequestException,
  } from '@nestjs/common';
  import {
    LoginDto,
    LogoutDto,
    NewTokensDto,
    ResendOtpDto,
    VerifyOtpDto,
  } from './dto/auth.dto';
  import * as bcrypt from 'bcrypt';
  import { Model, Types } from 'mongoose';
  import { CommonService } from '../common/common.service';
  import { ConfigService } from '@nestjs/config';
  import { ClientProxy } from '@nestjs/microservices';
  import { JwtService } from '@nestjs/jwt';
  import { USER_MODEL, UserDocument } from '../schema/user.schema';
  import { InjectModel } from '@nestjs/mongoose';
  import { TokenExpiredError, JsonWebTokenError } from 'jsonwebtoken';
  import CONFIG from '../constants/config.json';
  import { USER_TYPE } from 'src/constants/enum';
//   import {
//     INSURANCE_COMPANY_MODEL,
//     InsuranceCompanyDocument,
//   } from 'src/schema/insurance_company.schema';
  import { OTP_MODE, OTP_TYPE } from 'src/common/enum';
  import { USER_OTP_MODEL, UserOtpDocument } from 'src/schema/user_otp.schema';
  import { CONFIG_MODEL, ConfigDocument } from 'src/schema/config.schema';
  
  @Injectable()
  export class AuthService {
    constructor(
      @InjectModel(USER_MODEL) private userModel: Model<UserDocument>,
      // @InjectModel(INSURANCE_COMPANY_MODEL)
      // private insuranceCompanyModel: Model<InsuranceCompanyDocument>,
      private readonly commonService: CommonService,
      private configService: ConfigService,
      private jwtService: JwtService,
      @InjectModel(USER_OTP_MODEL) private userOtpModel: Model<UserOtpDocument>,
      @InjectModel(CONFIG_MODEL)
      private configModel: Model<ConfigDocument>,
    ) {}
  
    async login(
      loginDto: LoginDto,
      rmqNotificationOtpEmail?: ClientProxy,
      rmqNotificationOtpSms?: ClientProxy,
    ) {
      const user = await this.userModel.findOne(
        { email: loginDto.email },
        {
          isActive: 1,
          password: 1,
          type: 1,
          email: 1,
          firstName: 1,
          phoneCode: 1,
          phoneNumber: 1,
          roleId: 1,
        },
      );
  
      // check user:
      if (!user) {
        throw new NotFoundException(
          'You have entered an invalid email or password',
        );
      }
  
      if (user && !user.isActive) {
        throw new ForbiddenException('Inactive user cannot login');
      }
  
      const isPasswordMatched = await bcrypt.compare(
        loginDto.password,
        user.password,
      );
  
      if (!isPasswordMatched) {
        throw new UnauthorizedException(
          'You have entered an invalid email or password',
        );
      }
  
      const configOtp = await this.configModel.findOne(
        { configCode: 'otp' },
        { data: 1 },
      );
  
      if (!configOtp) {
        throw new NotFoundException('OTP Settings not found.');
      }
  
      let otpMode;
  
      if (configOtp.data.sms === true && configOtp.data.email === true) {
        otpMode = OTP_MODE.ALL;
      } else if (configOtp.data.sms === false && configOtp.data.email === true) {
        otpMode = OTP_MODE.EMAIL;
      } else if (configOtp.data.sms === true && configOtp.data.email === false) {
        otpMode = OTP_MODE.SMS;
      }
  
      const userOtp = await this.userOtpModel.findOne(
        { userId: user._id },
        { verifyOTPCount: 1, retryAfter: 1 },
      );
  
      let attemptsLeft;
  
      if (userOtp) {
        attemptsLeft = userOtp.verifyOTPCount;
  
        if (attemptsLeft === 0) {
          if (userOtp.retryAfter && Date.now() < userOtp.retryAfter) {
            const minutesRemaining = Math.ceil(
              (new Date(userOtp.retryAfter).getTime() - new Date().getTime()) /
                (60 * 1000),
            );
  
            throw new BadRequestException({
              message: `OTP limit has exceeded since you made too many wrong attempts. Please try again after ${minutesRemaining} minute(s).`,
              status: false,
            });
          }
        }
      }
  
      attemptsLeft = 5;
  
      if(process.env.NODE_ENV !== 'DEV'){
      if (otpMode === OTP_MODE.ALL) {
        const context = await this.updateUserOtpModel(
          user,
          OTP_MODE.ALL,
          attemptsLeft,
        );
        await this.sendOtpEmail(context?.email, rmqNotificationOtpEmail);
        await this.sendOtpSms(context?.sms, rmqNotificationOtpSms);
        return { message: 'OTP sent successfully', _id: user._id };
      } else if (otpMode === OTP_MODE.EMAIL) {
        const context = await this.updateUserOtpModel(
          user,
          OTP_MODE.EMAIL,
          attemptsLeft,
        );
        await this.sendOtpEmail(context, rmqNotificationOtpEmail);
        return { message: 'OTP sent successfully', _id: user._id };
      } else if (otpMode === OTP_MODE.SMS) {
        const context = await this.updateUserOtpModel(
          user,
          OTP_MODE.SMS,
          attemptsLeft,
        );
        await this.sendOtpSms(context, rmqNotificationOtpSms);
        return { message: 'OTP sent successfully', _id: user._id };
      } else {
        throw new BadRequestException('OTP mode is required');
      }
    }   
    return { message: 'OTP sent successfully', _id: user._id };
}
  
    async logout(logoutDto: LogoutDto) {
      const isTokenVerified = await this.verifyRefreshToken(
        logoutDto.refreshToken,
      );
      if (!isTokenVerified) {
        throw new UnauthorizedException('Refresh token is invalid');
      }
  
      const _id = new Types.ObjectId(logoutDto.userId);
      const user = await this.userModel.findOne(
        { _id: _id },
        { refreshToken: 1 },
      );
      if (user?.refreshToken === logoutDto.refreshToken) {
        await this.deleteRefreshTokenFromDB(user._id);
  
        return { message: 'You have successfully logged out' };
      } else {
        throw new UnauthorizedException('Refresh token is invalid');
      }
    }
  
    async generateNewTokensOnRequest(newTokensDto: NewTokensDto) {
      const { continueSession } = newTokensDto;
  
      const refreshTokenData = await this.verifyRefreshToken(
        newTokensDto.refreshToken,
      );
      if (!refreshTokenData) {
        throw new UnauthorizedException('Refresh token is invalid');
      }
  
      const _id = new Types.ObjectId(refreshTokenData._id);
      const roleId = new Types.ObjectId(refreshTokenData.roleId);
      const user = await this.userModel.findOne(
        { _id: _id },
        {
          refreshToken: 1,
          lastRefreshTokenGeneratedAt: 1,
          email: 1,
          type: 1,
          isSuperAdmin: 1,
          insuranceCompanyId: 1,
          insuranceCompanyName: 1,
        },
      );
      if (user?.refreshToken !== newTokensDto.refreshToken) {
        throw new UnauthorizedException('Refresh token is invalid');
      }
  
      if (!continueSession) {
        const minutes = await this.getMinutesBetweenDates(
          new Date(user.lastRefreshTokenGeneratedAt),
          new Date(),
        );
  
        console.log(
          `\n\n\n*** Time difference in Login for user = ${user.email} is ${minutes} ***\n\n\n`,
        );
  
        if (minutes >= 60) {
          throw new UnauthorizedException(
            'Authentication failed: Access token is expired',
          );
        }
      }
  
      const accessSections = await this.commonService.getAccessSectionsByUserId(
        _id,
        roleId
      );
  
      const payloadForToken =
        user.type === USER_TYPE.ADMIN
          ? {
              _id: user._id,
              email: user.email,
              type: user.type,
              isSuperAdmin: user.isSuperAdmin,
              accessSections: accessSections,
            }
          : {
              _id: user._id,
              email: user.email,
              type: user.type,
              isSuperAdmin: user.isSuperAdmin,
            //   insuranceCompanyId: user.insuranceCompanyId,
            //   insuranceCompanyName: user.insuranceCompanyName,
              accessSections: accessSections,
            };
  
      const accessToken = await this.generateAccessToken(payloadForToken);
      const refreshToken = await this.generateRefreshToken(payloadForToken);
  
      await this.updateRefreshTokenInDB(_id, refreshToken);
  
      return {
        tokens: {
          accessToken: accessToken,
          refreshToken: refreshToken,
          accessSections: accessSections,
        },
      };
    }
  
    async changePassword(accessTokenData, changePasswordDto) {
      const _id = new Types.ObjectId(accessTokenData._id);
      const user = await this.userModel.findOne(
        { _id: _id },
        { password: 1, isSuperAdmin: 1 },
      );
      if (!user) {
        throw new NotFoundException('Invalid request. No user found.');
      }
  
      let isPasswordMatched;
      isPasswordMatched = await bcrypt.compare(
        changePasswordDto.oldPassword,
        user.password,
      );
      if (!isPasswordMatched) {
        throw new UnauthorizedException('Invalid existing password');
      }
  
      if (accessTokenData.type === USER_TYPE.ADMIN && user.isSuperAdmin) {
        throw new ForbiddenException('Super admin password cannot be changed');
      } else {
        await this.changePasswordInDB(_id, changePasswordDto.newPassword);
  
        return { message: 'Password changed successfully' };
      }
    }
  
    async createResetPasswordLink(
      email,
      rmqNotificationForgetEmail?: ClientProxy,
    ) {
      const user = await this.userModel.findOne(
        { email: email },
        { type: 1, isSuperAdmin: 1, email: 1, firstName: 1, roleId: 1 },
      );
      if (!user) {
        return { message: 'Reset password email is sent to registered email' };
      }
      if (user.type === USER_TYPE.ADMIN && user.isSuperAdmin) {
        return { message: 'Reset password email is sent to registered email' };
      }
      
      const accessSections = await this.commonService.getAccessSectionsByUserId(
        user._id,
        user.roleId,
      );
  
      const passwordToken = await this.generatePasswordToken(
        user._id,
        user.email,
        user.type,
        accessSections,
      );
      await this.updatePasswordTokenInDB(user._id, passwordToken);
  
      const userName = user.firstName;
      const app_url = this.configService.get('APP_URL');
      const resetPasswordLink = `${app_url}reset-password?token=${passwordToken}`;
  
      const context = {
        email,
        name: userName,
        resetPasswordLink,
      };
      // await this.sendEmail(context, rmqNotificationForgetEmail);
  
      return { message: 'Reset password email is sent to registered email' };
    }
  
    async resetPassword(resetPasswordDto) {
      const accessTokenData = await this.verifyAccessToken(
        resetPasswordDto.passwordToken,
      );
      if (!accessTokenData) {
        throw new UnauthorizedException('Access token is invalid');
      }
  
      const _id = new Types.ObjectId(accessTokenData._id);
      const user = await this.userModel.findOne(
        { _id: _id },
        { passwordToken: 1 },
      );
      if (user?.passwordToken === resetPasswordDto.passwordToken) {
        await this.deletePasswordTokenFromDB(_id);
      } else {
        throw new UnauthorizedException('Password token is invalid');
      }
  
      await this.changePasswordInDB(_id, resetPasswordDto.password);
  
      return { message: 'Password reset successfully' };
    }
  
    async generateAccessToken(payloadForToken) {
      const accessToken = await this.jwtService.signAsync(payloadForToken, {
        privateKey: this.configService.get('JWT_ACCESS_TOKEN_PRIVATE_KEY'),
        expiresIn: this.configService.get('JWT_ACCESS_TOKEN_EXPIRES_IN'),
        algorithm: 'RS512',
      });
  
      return accessToken;
    }
  
    async generateRefreshToken(payloadForToken) {
      const refreshToken = await this.jwtService.signAsync(payloadForToken, {
        privateKey: this.configService.get('JWT_REFRESH_TOKEN_PRIVATE_KEY'),
        expiresIn: this.configService.get('JWT_REFRESH_TOKEN_EXPIRES_IN'),
        algorithm: 'RS512',
      });
  
      return refreshToken;
    }
  
    async updateRefreshTokenInDB(userId: Types.ObjectId, refreshToken: string) {
      await this.userModel.updateOne(
        { _id: userId },
        {
          $set: {
            refreshToken: refreshToken,
            lastRefreshTokenGeneratedAt: new Date(),
          },
        },
        { upsert: true },
      );
    }
  
    async updatelastLoginAtInDB(userId: Types.ObjectId) {
      await this.userModel.updateOne(
        { _id: userId },
        { $set: { lastLoginAt: new Date() } },
        { upsert: true },
      );
    }
  
    async verifyRefreshToken(token) {
      try {
        const refreshTokenVerificationResult = await this.jwtService.verifyAsync(
          token,
          {
            publicKey: this.configService.get('JWT_REFRESH_TOKEN_PUBLIC_KEY'),
          },
        );
  
        return refreshTokenVerificationResult;
      } catch (error) {
        if (error instanceof TokenExpiredError) {
          throw new UnauthorizedException('Refresh token is expired');
        } else if (error instanceof JsonWebTokenError) {
          throw new UnauthorizedException('Refresh token is invalid');
        }
      }
    }
  
    async deleteRefreshTokenFromDB(_id) {
      try {
        await this.userModel.updateOne(
          { _id: _id },
          { $set: { refreshToken: null } },
        );
      } catch (error) {
        throw new InternalServerErrorException(error.message);
      }
    }
  
    async changePasswordInDB(userId, newPassword) {
      try {
        const hashPassword = await bcrypt.hash(newPassword, 10);
        await this.userModel.findOneAndUpdate(
          { _id: userId },
          { password: hashPassword },
        );
      } catch (error) {
        throw new InternalServerErrorException(error.message);
      }
    }
    async generatePasswordToken(
      _id: Types.ObjectId,
      email: string,
      type: string,
      accessSections,
    ) {
      const passwordToken = await this.jwtService.signAsync(
        {
          _id,
          email,
          type,
          accessSections,
        },
        {
          privateKey: this.configService.get('JWT_ACCESS_TOKEN_PRIVATE_KEY'),
          expiresIn: this.configService.get(
            'JWT_ACCESS_TOKEN_PASSWORD_EXPIRES_IN',
          ),
          algorithm: 'RS512',
        },
      );
  
      return passwordToken;
    }
  
    async updatePasswordTokenInDB(userId: Types.ObjectId, passwordToken: string) {
      await this.userModel.updateOne(
        { _id: userId },
        { $set: { passwordToken: passwordToken } },
        { upsert: true },
      );
    }
  
    async sendEmail(context, rmqService) {
      await rmqService.emit(
        CONFIG.RMQ_NOTIFICATION_FORGET_EMAIL,
        JSON.stringify({
          userName: context.name,
          userEmail: context.email,
          link: context.resetPasswordLink,
        }),
      );
    }
  
    async sendOtpEmail(context, rmqService) {
      await rmqService.emit(
        CONFIG.RMQ_NOTIFICATION_OTP_EMAIL,
        JSON.stringify({
          userName: context.name,
          userEmail: context.email,
          otp: context.otp,
        }),
      );
    }
  
    async sendOtpSms(context, rmqService) {
      await rmqService.emit(
        CONFIG.RMQ_NOTIFICATION_OTP_SMS,
        JSON.stringify({
          phoneCode: context.phoneCode,
          phoneNumber: context.phoneNumber,
          otp: context.otp,
        }),
      );
    }
  
    async verifyAccessToken(token) {
      try {
        const accessTokenVerificationResult = await this.jwtService.verifyAsync(
          token,
          {
            publicKey: this.configService.get('JWT_ACCESS_TOKEN_PUBLIC_KEY'),
          },
        );
  
        return accessTokenVerificationResult;
      } catch (error) {
        if (error instanceof TokenExpiredError) {
          throw new UnauthorizedException('Access token is expired');
        } else if (error instanceof JsonWebTokenError) {
          throw new UnauthorizedException('Access token is invalid');
        }
      }
    }
    async deletePasswordTokenFromDB(_id) {
      try {
        await this.userModel.updateOne(
          { _id: _id },
          { $set: { passwordToken: null } },
        );
      } catch (error) {
        throw new InternalServerErrorException(error.message);
      }
    }
  
    async getMinutesBetweenDates(startTime, endTime) {
      const diff = endTime.getTime() - startTime.getTime();
  
      return diff / 60000;
    }
  
    async resendOtp(
      resendOtpDto: ResendOtpDto,
      rmqNotificationOtpEmail?: ClientProxy,
      rmqNotificationOtpSms?: ClientProxy,
    ) {
      const _id = new Types.ObjectId(resendOtpDto.userId);
  
      const user = await this.userModel.findOne(
        { _id: _id },
        {
          isActive: 1,
          password: 1,
          type: 1,
          email: 1,
          isSuperAdmin: 1,
          insuranceCompanyId: 1,
          insuranceCompanyName: 1,
          otpMode: 1,
          firstName: 1,
        },
      );
  
      if (!user) {
        throw new NotFoundException('Invalid request. No user found.');
      }
  
      if (user && !user.isActive) {
        throw new ForbiddenException('Inactive user cannot login');
      }
  
      const configOtp = await this.configModel.findOne(
        { configCode: 'otp' },
        { data: 1 },
      );
  
      if (!configOtp) {
        throw new NotFoundException('OTP Settings not found.');
      }
  
      let otpMode;
  
      if (configOtp.data.sms === true && configOtp.data.email === true) {
        otpMode = OTP_MODE.ALL;
      } else if (configOtp.data.sms === false && configOtp.data.email === true) {
        otpMode = OTP_MODE.EMAIL;
      } else if (configOtp.data.sms === true && configOtp.data.email === false) {
        otpMode = OTP_MODE.SMS;
      }
  
      const userOtp = await this.userOtpModel.findOne(
        { userId: user._id },
        { retryAfter: 1, verifyOTPCount: 1 },
      );
  
      if (!userOtp) {
        throw new BadRequestException('Please login to generate OTP');
      }
  
      const attemptsLeft = userOtp.verifyOTPCount;
  
      if (attemptsLeft === 0) {
        if (userOtp.retryAfter && Date.now() < userOtp.retryAfter) {
          const minutesRemaining = Math.ceil(
            (new Date(userOtp.retryAfter).getTime() - new Date().getTime()) /
              (60 * 1000),
          );
  
          throw new BadRequestException(
            `OTP limit has exceeded since you made too many wrong attempts. Please try again after ${minutesRemaining} minute(s).`,
          );
        }
      }
  
      if (otpMode === OTP_MODE.ALL) {
        const context = await this.updateUserOtpModel(
          user,
          OTP_MODE.ALL,
          attemptsLeft,
        );
  
        await this.sendOtpEmail(context?.email, rmqNotificationOtpEmail);
        await this.sendOtpSms(context?.sms, rmqNotificationOtpSms);
  
        return { message: 'OTP sent successfully', _id: user._id };
      } else if (otpMode === OTP_MODE.EMAIL) {
        const context = await this.updateUserOtpModel(
          user,
          OTP_MODE.EMAIL,
          attemptsLeft,
        );
  
        await this.sendOtpEmail(context, rmqNotificationOtpEmail);
      } else if (otpMode === OTP_MODE.SMS) {
        const context = await this.updateUserOtpModel(
          user,
          OTP_MODE.SMS,
          attemptsLeft,
        );
  
        await this.sendOtpSms(context, rmqNotificationOtpSms);
      } else {
        throw new BadRequestException('OTP mode is required');
      }
    }
  
    async verifyOtp(verifyOtpDto: VerifyOtpDto) {
      const _id = new Types.ObjectId(verifyOtpDto.userId);
  
      const user = await this.userModel.findOne(
        { _id: _id },
        {
          isActive: 1,
          type: 1,
          email: 1,
          isSuperAdmin: 1,
          insuranceCompanyId: 1,
          insuranceCompanyName: 1,
          roleId: 1,
        },
      );
  
      if (!user) {
        throw new NotFoundException('Invalid request. No user found.');
      }
  
      if (user && !user.isActive) {
        throw new ForbiddenException('Inactive user cannot login');
      }
  
      if(process.env.NODE_ENV !== 'DEV'){
      const userOtp = await this.userOtpModel.findOne(
        { userId: _id },
        { verifyOTPCount: 1, retryAfter: 1, OTP: 1, OTPExpiration: 1 },
      );
  
      if (!userOtp) {
        throw new BadRequestException('OTP Invalid');
      }
  
      const attemptsLeft = userOtp.verifyOTPCount;
  
      let minutesRemaining;
  
      if (attemptsLeft === 0) {
        if (userOtp.retryAfter && Date.now() < userOtp.retryAfter) {
          minutesRemaining = Math.ceil(
            (new Date(userOtp.retryAfter).getTime() - new Date().getTime()) /
              (60 * 1000),
          );
  
          throw new BadRequestException({
            message: `OTP limit has exceeded since you made too many wrong attempts. Please try again after ${minutesRemaining} minute(s).`,
            status: false,
          });
        }
      }
  
      // change if condition to => this.configService.get('NODE_ENV') === 'PROD' when goes live
      if (
        (this.configService.get('NODE_ENV') === 'DEV' ||
          this.configService.get('NODE_ENV') === 'UAT') &&
        verifyOtpDto.OTP !== '0000'
      ) {
        if (userOtp.OTP !== verifyOtpDto.OTP) {
          const userOtpData = await this.userOtpModel.findOneAndUpdate(
            { userId: _id },
            { $inc: { verifyOTPCount: -1 } },
            { new: true },
          );
  
          if (userOtpData?.verifyOTPCount === 0) {
            const retryAfter = new Date().setHours(new Date().getHours() + 1);
            await this.userOtpModel.findOneAndUpdate(
              { userId: _id },
              { $set: { retryAfter: retryAfter } },
            );
  
            throw new BadRequestException({
              message: `OTP limit has exceeded since you made too many wrong attempts. Please try again after 1 hour.`,
              status: false,
            });
          }
  
          throw new BadRequestException(
            `OTP Invalid, only ${userOtpData?.verifyOTPCount} attempts left`,
          );
        } else if (userOtp.OTP === verifyOtpDto.OTP) {
          const minutes = await this.getMinutesBetweenDates(
            new Date(userOtp.OTPExpiration),
            new Date(),
          );
  
          if (minutes > 5) {
            throw new BadRequestException('OTP expired');
          }
  
          await this.userOtpModel.deleteOne({ userId: _id });
        }
      } else if (
        (this.configService.get('NODE_ENV') === 'DEV' ||
          this.configService.get('NODE_ENV') === 'UAT') &&
        verifyOtpDto.OTP === '0000'
      ) {
        await this.userOtpModel.deleteOne({ userId: _id });
      }
      else{
        if (userOtp.OTP !== verifyOtpDto.OTP) {
          const userOtpData = await this.userOtpModel.findOneAndUpdate(
            { userId: _id },
            { $inc: { verifyOTPCount: -1 } },
            { new: true },
          );
  
          if (userOtpData?.verifyOTPCount === 0) {
            const retryAfter = new Date().setHours(new Date().getHours() + 1);
            await this.userOtpModel.findOneAndUpdate(
              { userId: _id },
              { $set: { retryAfter: retryAfter } },
            );
  
            throw new BadRequestException({
              message: `OTP limit has exceeded since you made too many wrong attempts. Please try again after 1 hour.`,
              status: false,
            });
          }
  
          throw new BadRequestException(
            `OTP Invalid, only ${userOtpData?.verifyOTPCount} attempts left`,
          );
        } else if (userOtp.OTP === verifyOtpDto.OTP) {
          const minutes = await this.getMinutesBetweenDates(
            new Date(userOtp.OTPExpiration),
            new Date(),
          );
  
          if (minutes > 5) {
            throw new BadRequestException('OTP expired');
          }
  
          await this.userOtpModel.deleteOne({ userId: _id });
        }
      }
    }
      const accessSections = await this.commonService.getAccessSectionsByUserId(
        user._id,
        user.roleId,
      );
  
      const payloadForToken =
        user.type === USER_TYPE.ADMIN
          ? {
              _id: user._id,
              roleId: user.roleId,
              email: user.email,
              type: user.type,
              isSuperAdmin: user.isSuperAdmin,
              accessSections: accessSections,
            }
          : {
              _id: user._id,
              email: user.email,
              type: user.type,
              isSuperAdmin: user.isSuperAdmin,
            //   insuranceCompanyId: user.insuranceCompanyId,
            //   insuranceCompanyName: user.insuranceCompanyName,
              accessSections: accessSections,
            };
  
      const accessToken = await this.generateAccessToken(payloadForToken);
      const refreshToken = await this.generateRefreshToken(payloadForToken);
  
      await this.updateRefreshTokenInDB(user._id, refreshToken);
      await this.updatelastLoginAtInDB(user._id);
  
      const userProfile = await this.commonService.getUserDataWithAccessSections(
        user._id,
      );
  
      const insuranceCompanyId = user
  
      let insuranceCompanyData;
  
    //   if (insuranceCompanyId) {
    //     insuranceCompanyData = await this.insuranceCompanyModel.findById(
    //       insuranceCompanyId,
    //       { hasTreatmentAndICD10Codes: 1 },
    //     );
    //   }
  
      let hasTreatmentAndICD10Codes;
      if (insuranceCompanyData) {
        hasTreatmentAndICD10Codes =
          insuranceCompanyData.hasTreatmentAndICD10Codes;
      }
  
      if (insuranceCompanyId) {
        return {
          userProfile: userProfile.length > 0 ? userProfile[0] : {},
          tokens: {
            accessToken: accessToken,
            refreshToken: refreshToken,
          },
          hasTreatmentAndICD10Codes: hasTreatmentAndICD10Codes,
        };
      } else {
        return {
          userProfile: userProfile.length > 0 ? userProfile[0] : {},
          tokens: {
            accessToken: accessToken,
            refreshToken: refreshToken,
          },
        };
      }
    }
  
    async updateUserOtpModel(user, otpMode: OTP_MODE, attemptsLeft) {
      const otp = Math.floor(1000 + Math.random() * 9000);
  
      await this.userOtpModel.updateOne(
        { userId: user._id },
        {
          $set: {
            otpMode: otpMode,
            type: OTP_TYPE.LOGIN,
            email: user.email,
            phoneCode: user.phoneCode,
            phoneNumber: user.phoneNumber,
            OTP: otp,
            OTPExpiration: Date.now(),
            verifyOTPCount: attemptsLeft,
            retryAfter: null,
          },
        },
        { upsert: true },
      );
  
      const userName = user.firstName;
  
      if (otpMode === OTP_MODE.ALL) {
        return {
          email: {
            email: user.email,
            name: userName,
            otp,
          },
          sms: {
            phoneCode: user.phoneCode,
            phoneNumber: user.phoneNumber,
            otp: otp,
          },
        };
      } else if (otpMode === OTP_MODE.SMS) {
        return {
          phoneCode: user.phoneCode,
          phoneNumber: user.phoneNumber,
          otp: otp,
        };
      } else if (otpMode === OTP_MODE.EMAIL) {
        return {
          email: user.email,
          name: userName,
          otp,
        };
      }
    }
  }
  