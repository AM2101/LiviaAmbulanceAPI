import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { ROLE_TYPE_LIVIA_ADMIN } from '../constants/enum';
import { Role, ROLE_MODEL } from './Role.schema';

@Schema({ timestamps: true, collection: 'RoleAccess' })
export class RoleAccess {
  @Prop({ type: Types.ObjectId, ref: ROLE_MODEL, index: true })
  roleId: Types.ObjectId | Role;

  @Prop({
    type: String,
    required: true,
  })
  module: string;

  @Prop({
    type: Boolean,
    required: true,
  })
  readAccess?: boolean;

  @Prop({
    type: Boolean,
    required: true,
  })
  writeAccess?: boolean;
}

export type RoleAccessDocument = RoleAccess & Document;

export const ROLE_ACCESS_MODEL = RoleAccess.name; // UserRole

export const RoleAccessSchema = SchemaFactory.createForClass(RoleAccess);
