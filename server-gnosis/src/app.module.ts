import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose'; // Import MongooseModule
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CourseModule } from './course/course.module';
import { LessonModule } from './lesson/lesson.module';
import { ProfileModule } from './profile/profile.module';

import { UserModule } from './user/user.module';

import { AuthModule } from './auth/auth.module';
import { UsergoogleModule } from './usergoogle/usergoogle.module';
import { AuthorModule } from './author/author.module';
import { CategoryModule } from './category/category.module';
import { ChapterModule } from './chapter/chapter.module';
import { UploadModule } from './upload/upload.module';
import { CartModule } from './cart/cart.module';
import { LessonCompletionModule } from './lesson-completion/lesson-completion.module';
import { NoteModule } from './note/note.module';
import { RatingModule } from './rating/rating.module';
import { VnpayModule } from './vnpay/vnpay.module';

import { LoggerModule } from './logger/logger.module';
import { FavoritesModule } from './favorites/favorites.module';
import { RevenueModule } from './revenue/revenue.module';
import { SalaryModule } from './salary/salary.module';
import { PaymentModule } from './payment/payment.module';




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

    UserModule,
  
    AuthModule,
    UsergoogleModule,
    AuthorModule,
    CategoryModule,
    ChapterModule,
    UploadModule,
    CartModule,

    LessonCompletionModule,
    NoteModule,
    RatingModule,
    VnpayModule,

    LoggerModule,
    FavoritesModule,
    RevenueModule,
    SalaryModule,
    PaymentModule,

  ],
  controllers: [AppController],
  providers: [AppService],

})
export class AppModule { }
