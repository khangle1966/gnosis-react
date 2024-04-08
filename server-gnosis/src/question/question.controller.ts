/* eslint-disable prettier/prettier */
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpException,
  Put,
} from '@nestjs/common';
import { QuestionService } from './question.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { Question } from './entities/question.entity';

@Controller('v1/question')
export class QuestionController {
  constructor(private questionService: QuestionService) {}

  @Post()
  async create(@Body() createQuestionDto: CreateQuestionDto) {
    try {
      const createQuestion = await this.questionService.create(
        createQuestionDto,
      );
      return createQuestion;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Get()
  async findAll(): Promise<Question[]> {
    try {
      const questions = await this.questionService.findAll();
      return questions;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Question[]> {
    try {
      console.log(id);
      const question = await this.questionService.findOne(id);
      return question;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() UpdateQuestionDto: UpdateQuestionDto,
  ): Promise<Question> {
    try {
      const question = await this.questionService.update(id, UpdateQuestionDto);
      return question;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<Question> {
    try {
      const question = await this.questionService.remove(id);
      return question;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
}
