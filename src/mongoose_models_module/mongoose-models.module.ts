import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { USER_MODEL, UserSchema } from '../schema/user.schema';
import { USER_OTP_MODEL, UserOtpSchema } from 'src/schema/user_otp.schema';
const MODELS = [
  { name: USER_MODEL, schema: UserSchema },
  { name: USER_OTP_MODEL, schema: UserOtpSchema },
];

@Global()
@Module({
  imports: [MongooseModule.forFeature(MODELS)],
  exports: [MongooseModule],
})
export class MongooseModelModule {}
