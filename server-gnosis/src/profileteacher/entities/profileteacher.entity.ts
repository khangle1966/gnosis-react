import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsEmail } from 'class-validator';
import mongoose, { HydratedDocument } from 'mongoose';
import { Course } from 'src/course/entities/course.entity';

export type ProfileteacherDocument = HydratedDocument<Profileteacher>;

@Schema({ timestamps: true })
export class Profileteacher {
    @Prop({ required: true, unique: true })
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

    // Assuming contact, descriptions, teacherrating are strings or arrays of strings
    // You might need to adjust based on actual usage
    @Prop()
    contact: string;

    @Prop()
    descriptions: string;

    @Prop({ type: [{ type: String }] })
    teacherrating: string[];

    @Prop()
    totalstudents: number;

    @Prop({ type: [{ type: String }] })
    notifications: string[];

    // Referencing courses using mongoose.Schema.Types.ObjectId
    @Prop({
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
    })
    courses: Course[];

    @Prop({
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
    })
    completedlessons: Course[];

    @Prop({
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
    })
    totalcourses: Course[];
}
export const ProfileteacherSchema = SchemaFactory.createForClass(Profileteacher);
