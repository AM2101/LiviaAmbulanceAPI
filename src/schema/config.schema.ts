import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Document } from 'mongoose';
import { CONFIG_CODE } from 'src/constants/enum';

@Schema({ timestamps: true, collection: 'Config' })
export class Config extends Document {
  @Prop({
    type: String,
    required: true,
    index: true,
    enum: Object.keys(CONFIG_CODE),
  })
  configCode: CONFIG_CODE;

  @Prop({
    type: Object,
    required: true,
    default: {},
  })
  data: any;
}

export const ConfigSchema = SchemaFactory.createForClass(Config);

export type ConfigDocument = HydratedDocument<Config>;

export const CONFIG_MODEL = Config.name;
