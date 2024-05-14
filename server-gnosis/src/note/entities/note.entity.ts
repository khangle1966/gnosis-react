// src/notes/entities/note.entity.ts

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class Note extends Document {
    @Prop({ type: Types.ObjectId, ref: 'User' })
    userUid: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'Chapter' })
    chapterId: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'Lesson' })
    lessonId: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'Course' })
    courseId: Types.ObjectId;


    @Prop()
    notes: string;

    @Prop()
    duration: number; // Duration in seconds where the note was taken
    @Prop()
    lessonTitle: string;
}

export const NoteSchema = SchemaFactory.createForClass(Note);
