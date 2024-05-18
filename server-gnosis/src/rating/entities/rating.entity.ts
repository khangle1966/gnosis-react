import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Types } from 'mongoose';

@Schema()
export class Rating extends Document {
    @Prop({ type: Types.ObjectId, ref: 'Course' })
    courseId: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'User' })
    userId: Types.ObjectId;

    @Prop({ required: true })
    rating: number;

    @Prop()
    feedback: string;
}

export const RatingSchema = SchemaFactory.createForClass(Rating);
