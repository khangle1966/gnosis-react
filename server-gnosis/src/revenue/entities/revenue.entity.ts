import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RevenueDocument = Revenue & Document;

@Schema({ timestamps: true })
export class Revenue {
  @Prop({ required: true })
  orderId: string;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  month: number;

  @Prop({ required: true })
  year: number;

  @Prop({ required: true })
  authorId: string;

  @Prop({ required: true })
  courseId: string;


}

export const RevenueSchema = SchemaFactory.createForClass(Revenue);
