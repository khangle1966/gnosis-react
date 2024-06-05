// app.module.ts (hoặc module tương ứng của bạn)
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RevenueService } from './revenue.service';
import { RevenueController } from './revenue.controller';
import { Revenue, RevenueSchema } from './entities/revenue.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Revenue.name, schema: RevenueSchema }]),
    // Các module khác
  ],
  controllers: [RevenueController],
  providers: [RevenueService],
})
export class RevenueModule { }
