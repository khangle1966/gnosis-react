import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Image } from '../../upload/entities/image.entity';  // Đảm bảo đường dẫn đến file Image entity đúng

export type CourseDocument = HydratedDocument<Course>;

export enum Category {
  WEB = 'Web Development',
  MOBILE = 'Mobile Development',  // Sửa chính tả
}
@Schema({ timestamps: true }) // Use Mongoose's automatic timestamps
export class Course {
  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;
  @Prop()
  subTitle: string;


  @Prop()
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
  @Prop({ required: true, type: String }) // author could reference an Author schema
  authorId: string;

  @Prop({ required: true })
  duration: number; // In hours

  @Prop({ type: Date, default: () => Date.now() })
  publishedDate: Date;
}

export const CourseSchema = SchemaFactory.createForClass(Course);
