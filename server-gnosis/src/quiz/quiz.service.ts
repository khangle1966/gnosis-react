import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Quiz, QuizDocument } from './entities/quiz.entity';

@Injectable()
export class QuizService {
  constructor(@InjectModel(Quiz.name) private quizModel: Model<QuizDocument>) { }

  async getQuizById(id: string): Promise<Quiz> {
    try {
      return await this.quizModel.findOne({ courseId: id }).exec();
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async getAllQuizzes(): Promise<Quiz[]> {
    try {
      const quizzes = await this.quizModel.find().exec();
      return quizzes;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async getById(id: string): Promise<Quiz> {
    try {
      const quiz = await this.quizModel.findById(id).exec();
      return quiz;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
  async createQuiz(quizData: Quiz): Promise<Quiz> {
    try {
      const newQuiz = new this.quizModel(quizData);
      return await newQuiz.save();
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async updateQuiz(id: string, quizData: Quiz): Promise<Quiz> {
    try {
      const updatedQuiz = await this.quizModel.findOneAndUpdate(
        { _id: id },
        { ...quizData },
        { new: true },
      );
      return updatedQuiz;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async deleteQuiz(id: string): Promise<any> {
    try {
      const deletedQuiz = await this.quizModel.findByIdAndDelete(id);
      return deletedQuiz;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
}
