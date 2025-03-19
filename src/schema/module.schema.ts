import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Document } from 'mongoose';

@Schema({ timestamps: true, collection: 'Modules' })
export class Module extends Document {
  @Prop({
    type: String,
    required: true,
  })
  name: string;
}

export const ModuleSchema = SchemaFactory.createForClass(Module);

export type ModuleDocument = HydratedDocument<Module>;

export const MODULE_MODEL = Module.name;
