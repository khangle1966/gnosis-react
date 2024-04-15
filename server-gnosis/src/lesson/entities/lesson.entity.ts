import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type CourseDocument = HydratedDocument<Lesson>;
@Schema({ timestamps: true })
export class Lesson {
    @Prop()
    ordinalNum: number;
    @Prop({ require: true, unique: true })
    public titleChapter: string;
    @Prop({ require: true, unique: true })
    public chapterNumber: number;
    @Prop()
    title: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Course' })
    courseId: string;

    @Prop()
    img: string;

    @Prop()
    content: string;

    @Prop()
    description: string;

    @Prop({ required: true })
    duration: number; // In hours
}

export const LessonSchema = SchemaFactory.createForClass(Lesson);
