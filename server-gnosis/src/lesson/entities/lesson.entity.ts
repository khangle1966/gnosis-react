import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Chapter } from '../../chapter/entities/chapter.entity'; // Đảm bảo rằng đường dẫn này chính xác
import { Document, Types } from 'mongoose';

export type LessonDocument = HydratedDocument<Lesson>;
@Schema({ timestamps: true })
export class Lesson {
    @Prop()
    ordinalNum: number;
    @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Chapter' })
    chapterId: string; // Tham chiếu đến Chapter
    @Prop()
    title: string;
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Course' })
    courseId: string;
    @Prop()
    description: string;
    @Prop({ required: true })
    duration: number; // In hours
}

export const LessonSchema = SchemaFactory.createForClass(Lesson);
