/* eslint-disable prettier/prettier */
import { HttpException, Injectable } from '@nestjs/common';
import { CreateQuizBankDto } from './dto/create-quiz-bank.dto';
import { UpdateQuizBankDto } from './dto/update-quiz-bank.dto';
import { InjectModel } from '@nestjs/mongoose';
import { QuizBank } from './entities/quiz-bank.entity';
import { Model } from 'mongoose';

@Injectable()
export class QuizBankService {
  constructor(
    @InjectModel(QuizBank.name) private quizBankModel: Model<QuizBank>,
  ) { }

  async create(createQuizBankDto: CreateQuizBankDto): Promise<QuizBank> {
    try {
      const quizBank = new this.quizBankModel(createQuizBankDto);
      return await quizBank.save();
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async findAll() {
    try {
      return await this.quizBankModel.find().exec();
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
  async findOne(id: string) {
    try {
      const quizBank = await this.quizBankModel.findById({ _id: id });
      return quizBank;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async update(id: string, updateQuizBankDto: UpdateQuizBankDto) {
    try {
      const updatedQuizBank = await this.quizBankModel.findOneAndUpdate(
        { _id: id },
        { ...updateQuizBankDto },
        { new: true },
      );
      return updatedQuizBank;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async remove(id: string) {
    try {
      const deletedQuizBank = await this.quizBankModel.findOneAndDelete({
        _id: id,
      });
      return deletedQuizBank;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
}
