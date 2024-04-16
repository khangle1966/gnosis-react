<<<<<<< HEAD
/* eslint-disable prettier/prettier */
import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';

import { HydratedDocument } from 'mongoose';
=======
import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
>>>>>>> 916cca0 (a)

export type CourseDocument = HydratedDocument<Course>;

export enum Category {
  WEB = 'Web Development',
<<<<<<< HEAD
  MOBILE = 'Mobule Development',
}

@Schema({ timestamps: true })
=======
  MOBILE = 'Mobile Development',  // Sửa chính tả
}
@Schema({ timestamps: true }) // Use Mongoose's automatic timestamps
>>>>>>> 916cca0 (a)
export class Course {
  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop()
<<<<<<< HEAD
  img: string;

  @Prop()
  category: Category;

  @Prop()
  price: number;

  @Prop()
  rating: number;

  @Prop()
  language: string;

  @Prop({ default: false })
  isReleased: boolean;

  @Prop()
  author: string;
=======
  img: string; // This should be a URL to the image

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
      message: props => `${props.value} is not a valid rating! Must be between 0 and 5.`
    }
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

  @Prop({ required: true, type: String }) // author could reference an Author schema
  author: string;

  @Prop({ required: true })
  duration: number; // In hours

  @Prop({ type: Date, default: () => Date.now() })
  publishedDate: Date;
>>>>>>> 916cca0 (a)
}

export const CourseSchema = SchemaFactory.createForClass(Course);
