import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { USER_TYPE, ACCESS_TYPE } from '../constants/enum';


@Schema({ timestamps: true, collection: 'User' })
export class User {
  @Prop({
    type: String,
    required: true,
  })
  firstName: string;

  @Prop({
    type: String,
    required: true,
  })
  lastName: string;

  @Prop({
    type: String,
    required: true,
    lowercase: true,
  })
  email: string;

  @Prop({
    type: String,
    required: true,
  })
  password: string;

  @Prop({
    type: String,
    required: true,
  })
  phoneCode: string;

  @Prop({
    type: String,
    required: true,
    unique: true,
  })
  phoneNumber: string;

  @Prop({
    type: String,
    enum: Object.keys(USER_TYPE),
    immutable: true,
    required: true,
  })
  type: USER_TYPE;

  @Prop({
    type: String,
    enum: Object.keys(ACCESS_TYPE),
  })
  access: ACCESS_TYPE;

  @Prop({
    type: Boolean,
    index: true,
  })
  isActive: boolean;

  @Prop({
    type: Date,
  })
  lastLoginAt: Date;

  @Prop({
    type: String,
  })
  refreshToken: string;

  @Prop({
    type: String,
  })
  passwordToken: string;

  @Prop({
    type: String,
  })
  device: string;

  @Prop({
    type: String,
  })
  createdBy: string;

  @Prop({
    type: Boolean,
    default: false,
  })
  isSuperAdmin: boolean;

  @Prop({
    type: Date,
  })
  lastRefreshTokenGeneratedAt: Date;
}

export type UserDocument = User & Document;

export const USER_MODEL = User.name; // User

export const UserSchema = SchemaFactory.createForClass(User);
