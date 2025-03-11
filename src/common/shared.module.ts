// shared.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { USER_MODEL, UserSchema } from '../schema/user.schema';
import { USER_OTP_MODEL, UserOtpSchema } from '../schema/user_otp.schema';
import { CONFIG_MODEL, ConfigSchema } from '../schema/config.schema';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: USER_MODEL, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: USER_OTP_MODEL, schema: UserOtpSchema }]),
    MongooseModule.forFeature([{ name: CONFIG_MODEL, schema: ConfigSchema }]),
  ],
  exports: [
    MongooseModule.forFeature([{ name: USER_MODEL, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: USER_OTP_MODEL, schema: UserOtpSchema }]),
    MongooseModule.forFeature([{ name: CONFIG_MODEL, schema: ConfigSchema }]),
  ],
})
export class SharedModule {}
