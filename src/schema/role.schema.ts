import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Document } from 'mongoose';

@Schema({ timestamps: true, collection: 'Roles' })
export class Role extends Document {
  @Prop({
    type: String,
    required: true,
  })
  roleName: string;
}

export const RoleSchema = SchemaFactory.createForClass(Role);

export type RoleDocument = HydratedDocument<Role>;

export const ROLE_MODEL = Role.name;
