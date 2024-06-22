import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsEmail } from 'class-validator';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<Usergoogle>;

@Schema({ timestamps: true })
export class Usergoogle {
    @Prop({ required: true, unique: true })
    uid: string;

    @IsEmail()
    @Prop({ required: true, unique: true })
    email: string;

    @Prop()
    name: string;

    @Prop()
    picture: string;

    @Prop({ default: null })
    profile: string;

    @Prop({ default: 'user' })
    role: string;

    @Prop({ required: function () { return this.role === 'instructor'; }, default: 'new' })
    instructorLevel: string;
    @Prop() // Khai báo trường createdAt
    createdAt: Date;

    @Prop({ default: false })
    isBanned: boolean;
}

export const UsergoogleSchema = SchemaFactory.createForClass(Usergoogle);
