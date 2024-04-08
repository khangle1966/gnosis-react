import { HttpException, Injectable } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Review } from './entities/review.entity';
import { Model } from 'mongoose';
import { QuizBank } from 'src/quiz-bank/entities/quiz-bank.entity';
import { Quiz } from 'src/quiz/entities/quiz.entity';

@Injectable()
export class ReviewService {
  constructor(
    @InjectModel(Review.name) private reviewModel: Model<Review>,
    @InjectModel(QuizBank.name) private quizBankModel: Model<QuizBank>,
    @InjectModel(Quiz.name) private quizModel: Model<Quiz>,
  ) { }


  async compareAnswer(data: CreateReviewDto) {

    try {
      const { quizId, profileId, test } = data;
      const quiz = await this.quizModel.findById({ _id: quizId });
      const total = quiz.total;
      let score = 0;
      for (let i = 0; i < test.length; i++) {
        const element = test[i];
        const quizBankId = element.quizBankId;
        const answer = element.answer;
        const quizBankData = await this.quizBankModel.findById({ _id: quizBankId });
        const correctAnswer = quizBankData.answerList;
        let countCorrect = 0;
        for (let j = 0; j < correctAnswer.length; j++) {
          if (answer.includes(correctAnswer[j])) {
            countCorrect++;
          }
        }
        if (countCorrect === correctAnswer.length) {
          //calculate score here know score = total / test.length
          score += Math.round(total / test.length);
        }
      }
      const createReview = new this.reviewModel({
        quizId,
        profileId,
        score,
        test
      });
      await createReview.save();
      return createReview;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
  async redoReview(id: string, data: UpdateReviewDto) {
    try {
      const { quizId, profileId, test } = data;
      const quiz = await this.quizModel.findById({ _id: quizId });
      const total = quiz.total;
      let score = 0;
      for (let i = 0; i < test.length; i++) {
        const element = test[i];
        const quizBankId = element.quizBankId;
        const answer = element.answer;
        const quizBankData = await this.quizBankModel.findById({ _id: quizBankId });
        const correctAnswer = quizBankData.answerList;
        let countCorrect = 0;
        for (let j = 0; j < correctAnswer.length; j++) {
          if (answer.includes(correctAnswer[j])) {
            countCorrect++;
          }
        }
        if (countCorrect === correctAnswer.length) {
          //calculate score here know score = total / test.length
          score += Math.round(total / test.length);
        }
      }
      const redoReview = await this.reviewModel.findOneAndUpdate(
        { _id: id },
        { ...data, score },
        { new: true },
      );
      return redoReview;
    }
    catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }


  async create(createReviewDto: CreateReviewDto): Promise<Review> {
    try {
      const review = new this.reviewModel(createReviewDto);
      return await review.save();
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async findAll() {
    try {
      const review = await this.reviewModel.find().exec();
      return review;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
  async findOneByQuizId(id: string) {
    try {
      const review = await this.reviewModel.findOne({ quizId: id })
        .select('-createdAt -updatedAt -__v')
        // .populate('quizId', '-createdAt -updatedAt -__v')
        .populate('test.quizBankId', '-createdAt -updatedAt -__v');
      return review;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async update(id: string, updateReviewDto: UpdateReviewDto) {
    try {
      const updatedReview = await this.reviewModel.findOneAndUpdate(
        { _id: id },
        { ...updateReviewDto },
        { new: true },
      );
      return updatedReview;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async remove(id: string) {
    try {
      const deletedReview = await this.reviewModel.findOneAndDelete({
        _id: id,
      });
      return deletedReview;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
}
