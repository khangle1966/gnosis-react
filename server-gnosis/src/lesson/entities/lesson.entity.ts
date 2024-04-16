import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type CourseDocument = HydratedDocument<Lesson>;
@Schema({ timestamps: true })
export class Lesson {
    @Prop()
    ordinalNum: number;
<<<<<<< HEAD

=======
    @Prop({ require: true, unique: true })
    public titleChapter: string;
    @Prop({ require: true, unique: true })
    public chapterNumber: number;
>>>>>>> 916cca0 (a)
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
<<<<<<< HEAD
=======

    @Prop({ required: true })
    duration: number; // In hours
>>>>>>> 916cca0 (a)
}

export const LessonSchema = SchemaFactory.createForClass(Lesson);
