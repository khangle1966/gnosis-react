

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type LessonCompletionDocument = Document & LessonCompletion;

@Schema()
export class LessonCompletion {
    @Prop({ required: true, ref: 'User' })
    userId: string;

    @Prop({ required: true, ref: 'Lesson' })
    lessonId: string;
    @Prop({ required: true, ref: 'Course' })
    courseId: string;

    @Prop({ required: true })
    completed: boolean;
}

export const LessonCompletionSchema = SchemaFactory.createForClass(LessonCompletion);
