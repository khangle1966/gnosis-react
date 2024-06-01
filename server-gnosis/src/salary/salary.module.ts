import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SalaryService } from './salary.service';
import { Salary, SalarySchema } from './entities/salary.entity';
import { Usergoogle, UsergoogleSchema } from '../usergoogle/entities/usergoogle.entity';
import { SalaryController } from './salary.controller';
import { LoggerModule } from '../logger/logger.module'; // Import LoggerModule

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Salary.name, schema: SalarySchema }]),
    MongooseModule.forFeature([{ name: Usergoogle.name, schema: UsergoogleSchema }]),
    LoggerModule, // Đảm bảo import LoggerModule

  ],
  providers: [SalaryService],
  controllers: [SalaryController],
  exports: [SalaryService],
})
export class SalaryModule { }
