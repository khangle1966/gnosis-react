/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { HydratedDocument } from 'mongoose';
<<<<<<< HEAD
=======
import { v4 as uuidv4 } from 'uuid';
>>>>>>> 916cca0 (a)

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
<<<<<<< HEAD
    @Prop({ required: true, unique: true })
=======
    @Prop({ default: () => uuidv4(), unique: true })
>>>>>>> 916cca0 (a)
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
<<<<<<< HEAD
=======

    @Prop({ default: 'user' })
    role: string;
>>>>>>> 916cca0 (a)
}

export const UserSchema = SchemaFactory.createForClass(User);
