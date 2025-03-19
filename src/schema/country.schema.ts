import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';

@Schema({
  timestamps: true,
  collection: 'Country',
})
export class Country extends Document {
  @Prop({ type: String, required: true })
  countryId: string;

  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true })
  code: string;

  @Prop({ type: String, required: true })
  phoneCode: string;
}

export const CountrySchema = SchemaFactory.createForClass(Country);

export type CountryDocument = HydratedDocument<Country>;

export const COUNTRY_MODEL = Country.name;
