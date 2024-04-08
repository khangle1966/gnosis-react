import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpStatus,
  HttpException,
  UseGuards,
} from '@nestjs/common';
import { QuizService } from './quiz.service';
import { Quiz } from './entities/quiz.entity';

@Controller('v1/quiz')
export class QuizController {
  constructor(private readonly quizService: QuizService) { }

  @Get(':id')
  async getById(@Param('id') id: string) {
    try {
      const quiz = await this.quizService.getQuizById(id);
      // console.log(quiz);
      return quiz;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Get(':id/quiz')
  async getQuizById(@Param('id') id: string) {
    try {
      const quiz = await this.quizService.getById(id);
      // console.log(quiz);
      return quiz;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Get()
  async getAll() {
    try {
      const quizzes = await this.quizService.getAllQuizzes();
      return quizzes;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Post()
  async create(@Body() quizData: Quiz) {
    try {
      const newQuiz = await this.quizService.createQuiz(quizData);
      return newQuiz;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() quizData: Quiz) {
    try {
      const updatedQuiz = await this.quizService.updateQuiz(id, quizData);
      if (!updatedQuiz) {
        throw new HttpException('Quiz not found', HttpStatus.BAD_REQUEST);
      }
      // console.log(updatedQuiz);
      return updatedQuiz;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    try {
      const deletedQuiz = await this.quizService.deleteQuiz(id);
      return deletedQuiz;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
}
