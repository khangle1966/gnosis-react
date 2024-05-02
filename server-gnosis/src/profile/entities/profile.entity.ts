import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsEmail } from 'class-validator';
import mongoose, { HydratedDocument } from 'mongoose';
import { Course } from 'src/course/entities/course.entity';

export type ProfileDocument = HydratedDocument<Profile>;

@Schema({ timestamps: true })
export class Profile {
    @Prop({ required: true, unique: true,index: true  })
    id: string;

    @Prop({ required: true, unique: true })
    userName: string;

    @Prop()
    displayName: string;

    @IsEmail()
    @Prop({ required: true, unique: true })
    email: string;

  
    @Prop()
    gender: string;

    @Prop()
    country: string;

    @Prop()
    avatar: string;

    @Prop()
    bio: string;


    @Prop()
    notifications: string[];


    @Prop({
        type: [{ type: mongoose.Schema.Types.ObjectId }],
        ref: 'Course',
    })
    completedCourse: Course[];

    @Prop({
        type: [{ type: mongoose.Schema.Types.ObjectId }],
        ref: 'Course',
    })
    ongoingCourse: Course[];

    @Prop({
        type: [{ type: mongoose.Schema.Types.ObjectId }],
        ref: 'Course',
    })
    courses: Course[];
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);
