import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Image extends Document {
    @Prop()
    url: string;

    @Prop()
    filename: string;

    @Prop()
    contentType: string;

    @Prop()
    size: number;
    
}

export const ImageSchema = SchemaFactory.createForClass(Image);
