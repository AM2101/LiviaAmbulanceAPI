import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { User, USER_MODEL } from './user.schema';
import { OTP_MODE, OTP_TYPE } from 'src/common/enum';

@Schema({ timestamps: true, collection: 'UserOtp' })
export class UserOtp {
  @Prop({ type: Types.ObjectId, ref: USER_MODEL, index: true })
  userId: Types.ObjectId | User;

  @Prop({
    type: String,
    enum: Object.keys(OTP_MODE),
    immutable: true,
    required: true,
  })
  otpMode: OTP_MODE;

  @Prop({
    type: String,
    enum: Object.keys(OTP_TYPE),
    immutable: true,
    required: true,
  })
  type: OTP_TYPE;

  @Prop({
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    index: true,
  })
  email: string;

  @Prop({
    type: String,
    required: true,
  })
  phoneCode: string;

  @Prop({
    type: String,
    required: true,
    index: true,
    trim: true,
  })
  phoneNumber: string;

  @Prop({
    type: String,
    required: true,
  })
  OTP: string;

  @Prop({
    type: Number,
    required: true,
    default: new Date().getTime(),
  })
  OTPExpiration: number;

  @Prop({
    type: Number,
    required: true,
    default: 5,
  })
  verifyOTPCount: number;

  @Prop({
    type: Number,
    required: true,
    default: null,
  })
  retryAfter: number;
}

export type UserOtpDocument = UserOtp & Document;

export const USER_OTP_MODEL = UserOtp.name;

export const UserOtpSchema = SchemaFactory.createForClass(UserOtp);
