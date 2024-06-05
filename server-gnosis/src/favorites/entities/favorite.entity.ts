import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Favorite extends Document {
    @Prop({ required: true })
    userId: string;

    @Prop({ type: [String], required: true })
    courseIds: string[];

    @Prop({ type: [String], default: [] })
    favorites: string[];
}

export const FavoriteSchema = SchemaFactory.createForClass(Favorite);
