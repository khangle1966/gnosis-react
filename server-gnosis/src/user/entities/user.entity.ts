/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
    @Prop({ required: true, unique: true })
    uid: string;

    @IsEmail()
    @Prop({ required: true, unique: true })
    email: string;
    @IsNotEmpty()
    @Prop({ required: true, unique: true })
    password: string;


    @Prop()
    name: string;

    @Prop()
    picture: string;

    @Prop({ default: null })
    profile: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
