import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type CourseDocument = HydratedDocument<Course>;

export enum Category {
  WEB = 'Web Development',
  MOBILE = 'Mobile Development',
  POPULAR = 'Popular',
  COMPUTERSCIENCE = 'Computer Science',
  ENGLISH = 'English',
  MUSIC = 'Music',
  COOK = 'Cook',
}

@Schema({ timestamps: true })
export class Course {
  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop()
  subTitle: string;

  @Prop()
  img: string;

  @Prop({ enum: Category, required: true })
  category: Category;

  @Prop({ required: true })
  price: number;

  @Prop({
    required: true,
    validate: {
      validator: function (v) {
        return v >= 0 && v <= 5 && Number.isFinite(v);
      },
      message: props => `${props.value} is not a valid rating! Must be between 0 and 5.`,
    },
  })
  rating: number;

  @Prop({ required: true })
  language: string;

  @Prop({ required: true })
  request: string;

  @Prop({ required: true })
  describe: string;

  @Prop({ default: false })
  isReleased: boolean;

  @Prop({ required: true, type: String })
  author: string;

  @Prop({ required: true, type: String })
  authorId: string;

  @Prop({ required: true })
  duration: number;

  @Prop({ type: Date, default: () => Date.now() })
  publishedDate: Date;

  @Prop({ default: 0 })
  numberOfStudents: number;

  @Prop({ default: 0 })
  numberOfReviews: number;



static calculateInstructorLevel(rating: number, numberOfStudents: number): string {
  if (rating >= 4.5 && numberOfStudents >= 1000) {
    return 'master';
  } else if (rating >= 3.5 && numberOfStudents >= 500) {
    return 'medium';
  } else {
    return 'new';
  }
}
}

export const CourseSchema = SchemaFactory.createForClass(Course);