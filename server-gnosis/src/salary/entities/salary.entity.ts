import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SalaryDocument = Salary & Document;

@Schema({ timestamps: true })
export class Salary {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  month: number;

  @Prop({ required: true })
  year: number;

  @Prop({ required: true })
  role: string;

  @Prop({ required: true })
  courseId: string;

}

export const SalarySchema = SchemaFactory.createForClass(Salary);
