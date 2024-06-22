import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { HydratedDocument } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
    @Prop({ default: () => uuidv4(), unique: true })
    uid: string;

    @IsEmail()
    @Prop({ required: true, unique: true })
    email: string;

    @IsNotEmpty()
    @Prop({ required: true })
    password: string;

    @Prop()
    name: string;

    @Prop()
    picture: string;

    @Prop({ default: null })
    profile: string;

    @Prop({ default: 'user' })
    role: string;

    @Prop()
    createdAt: Date;

    @Prop({ default: false })
    isBanned: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
