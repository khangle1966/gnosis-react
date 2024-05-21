import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Order extends Document {
  @Prop({ required: true })
  orderId: string;

  @Prop({ required: true })
  userId: string;

  @Prop({ type: [String], required: true })
  courseIds: string[];
}

export const OrderSchema = SchemaFactory.createForClass(Order);
