import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CourseModule } from './course/course.module';
import { LessonModule } from './lesson/lesson.module';
import { ProfileModule } from './profile/profile.module';
import { QuestionModule } from './question/question.module';
import { UserModule } from './user/user.module';
import { QuizModule } from './quiz/quiz.module';
import { QuizBankModule } from './quiz-bank/quiz-bank.module';
import { ReviewModule } from './review/review.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { UsergoogleModule } from './usergoogle/usergoogle.module';
import { ProfileteacherModule } from './profileteacher/profileteacher.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Biến môi trường toàn cục cho ứng dụng
    }),
    MongooseModule.forRoot('mongodb+srv://trungkhang223:khangdas123@gnosis.6by2f4q.mongodb.net/Gnosis?retryWrites=true&w=majority'),
    // Thêm tất cả các module khác của bạn vào đây...
    CourseModule,
    LessonModule,
    ProfileModule,
    QuestionModule,
    UserModule,
    QuizModule,
    QuizBankModule,
    ReviewModule,
    AuthModule,
    UsergoogleModule,
    ProfileteacherModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }