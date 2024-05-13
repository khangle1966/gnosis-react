import { PartialType } from '@nestjs/swagger';
import { CreateLessonCompletionDto } from './create-lesson-completion.dto';

export class UpdateLessonCompletionDto extends PartialType(CreateLessonCompletionDto) {}
