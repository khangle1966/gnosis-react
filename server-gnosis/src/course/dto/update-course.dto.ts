<<<<<<< HEAD
import { PartialType } from '@nestjs/mapped-types';
import { CreateCourseDto } from './create-course.dto';

export class UpdateCourseDto extends PartialType(CreateCourseDto) {}
=======
import * as mongoose from 'mongoose';
export class UpdateCourseDto {
    readonly title?: string;
    readonly description?: string;
    readonly instructor?: mongoose.Types.ObjectId;
    readonly category?: mongoose.Types.ObjectId;
    readonly language?: string;
    readonly duration?: number;
    readonly price?: number;
    readonly level?: string;
    readonly publishedDate?: Date;
}
>>>>>>> 916cca0 (a)
