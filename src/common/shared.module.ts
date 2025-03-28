// shared.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { USER_MODEL, UserSchema } from '../schema/user.schema';
import { USER_OTP_MODEL, UserOtpSchema } from '../schema/user_otp.schema';
import { CONFIG_MODEL, ConfigSchema } from '../schema/config.schema';
import { COUNTRY_MODEL, CountrySchema } from 'src/schema/country.schema';
import { ROLE_MODEL, RoleSchema } from 'src/schema/Role.schema';
import { MODULE_MODEL, ModuleSchema } from 'src/schema/module.schema';
import { ROLE_ACCESS_MODEL, RoleAccessSchema } from 'src/schema/role_access.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: USER_MODEL, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: USER_OTP_MODEL, schema: UserOtpSchema }]),
    MongooseModule.forFeature([{ name: CONFIG_MODEL, schema: ConfigSchema }]),
    MongooseModule.forFeature([{ name: COUNTRY_MODEL, schema: CountrySchema }]),
    MongooseModule.forFeature([{ name: ROLE_MODEL, schema: RoleSchema }]),
    MongooseModule.forFeature([{ name: MODULE_MODEL, schema: ModuleSchema }]),
    MongooseModule.forFeature([{ name: ROLE_ACCESS_MODEL, schema: RoleAccessSchema }]),
  ],
  exports: [
    MongooseModule.forFeature([{ name: USER_MODEL, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: USER_OTP_MODEL, schema: UserOtpSchema }]),
    MongooseModule.forFeature([{ name: CONFIG_MODEL, schema: ConfigSchema }]),
    MongooseModule.forFeature([{ name: COUNTRY_MODEL, schema: CountrySchema }]),
    MongooseModule.forFeature([{ name: ROLE_MODEL, schema: RoleSchema }]),
    MongooseModule.forFeature([{ name: MODULE_MODEL, schema: ModuleSchema }]),
    MongooseModule.forFeature([{ name: ROLE_ACCESS_MODEL, schema: RoleAccessSchema }]),
  ],
})
export class SharedModule { }
