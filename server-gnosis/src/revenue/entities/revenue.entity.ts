// schemas/revenue.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RevenueDocument = Revenue & Document;

@Schema()
export class Revenue {
  @Prop({ required: true })
  month: number;

  @Prop({ required: true })
  year: number;

  @Prop({ required: true })
  amount: number;
}

export const RevenueSchema = SchemaFactory.createForClass(Revenue);
