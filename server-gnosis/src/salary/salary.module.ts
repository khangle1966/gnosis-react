import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SalaryService } from './salary.service';
import { Salary, SalarySchema } from './entities/salary.entity';
import { Usergoogle, UsergoogleSchema } from '../usergoogle/entities/usergoogle.entity';
import { SalaryController } from './salary.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Salary.name, schema: SalarySchema }]),
    MongooseModule.forFeature([{ name: Usergoogle.name, schema: UsergoogleSchema }]),
  ],
  providers: [SalaryService],
  controllers: [SalaryController],
  exports: [SalaryService],
})
export class SalaryModule { }
