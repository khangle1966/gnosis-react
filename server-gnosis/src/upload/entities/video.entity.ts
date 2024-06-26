// src/entities/video.entity.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type VideoDocument = Video & Document;

@Schema()
export class Video {
    @Prop({ required: true })
    url: string;

    @Prop({ required: true })
    filename: string;

    @Prop()
    contentType: string;

    @Prop()
    size: number;
}

export const VideoSchema = SchemaFactory.createForClass(Video);
