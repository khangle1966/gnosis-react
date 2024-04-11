import { PartialType } from '@nestjs/mapped-types';
import { CreateProfileteacherDto } from './create-profileteacher.dto';

export class UpdateProfileteacherDto extends PartialType(CreateProfileteacherDto) {}
