/* eslint-disable prettier/prettier */
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
  Put,
} from '@nestjs/common';
import { QuizBankService } from './quiz-bank.service';
import { CreateQuizBankDto } from './dto/create-quiz-bank.dto';
import { UpdateQuizBankDto } from './dto/update-quiz-bank.dto';
import { QuizBank } from './entities/quiz-bank.entity';

@Controller('v1/quiz-bank')
export class QuizBankController {
  constructor(private quizBankService: QuizBankService) { }

  @Post()
  create(@Body() createQuizBankDto: CreateQuizBankDto) {
    try {
      const createQuizBank = this.quizBankService.create(createQuizBankDto);
      return createQuizBank;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Get()
  async findAll(): Promise<QuizBank[]> {
    try {
      const quizBank = await this.quizBankService.findAll();
      return quizBank;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const quizBank = await this.quizBankService.findOne(id);
      return quizBank;
    } catch (error) {
      throw error;
    }
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateQuizBankDto: UpdateQuizBankDto,
  ) {
    try {
      const quizBank = await this.quizBankService.update(id, updateQuizBankDto);
      return quizBank;
    } catch (error) {
      throw error;
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      const quizBank = await this.quizBankService.remove(id);
      return quizBank;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
}
