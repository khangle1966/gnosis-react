// src/chapter/entities/chapter.entity.ts

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Document } from 'mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({ timestamps: true })
export class Chapter {
    @Prop({ required: true })
    chapterNumber: number;

    @Prop({ type: Types.ObjectId, ref: 'Course', required: true })
    courseId: Types.ObjectId; // Link to Course model

    @Prop({ required: true })
    title: string;

    @Prop({ type: [{ type: Types.ObjectId, ref: 'Lesson' }] })
    lessons: Types.ObjectId[]; // Array of ObjectIds referencing Lesson
}

export type ChapterDocument = HydratedDocument<Chapter>;
export const ChapterSchema = SchemaFactory.createForClass(Chapter);
