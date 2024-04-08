import { PartialType } from '@nestjs/mapped-types';
import { CreateQuizBankDto } from './create-quiz-bank.dto';

export class UpdateQuizBankDto extends PartialType(CreateQuizBankDto) {}
