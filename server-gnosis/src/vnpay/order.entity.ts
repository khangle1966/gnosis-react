import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Order extends Document {
  @Prop({ required: true })
  orderId: string;

  @Prop({ required: true })
  userId: string;

  @Prop({ type: [String], required: true })
  courseIds: string[];

  @Prop({ required: true })
  amount: number;

  @Prop({ type: Date, default: Date.now })
  createAt: Date;

  @Prop({
    type: [
      {
        courseId: String,
        authorId: String,
        amount: Number,
      },
    ],
    required: true,
  })
  courseDetails: {
    courseId: string; authorId: string; amount: number
  }[];
}

export const OrderSchema = SchemaFactory.createForClass(Order);
