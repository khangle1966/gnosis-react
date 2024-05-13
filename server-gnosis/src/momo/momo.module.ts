import { Module } from '@nestjs/common';
import { MomoService } from './momo.service';
import { MomoController } from './momo.controller';
import { HttpModule } from '@nestjs/axios'; // Import HttpModule

@Module({
  controllers: [MomoController],
  providers: [MomoService],
  imports: [HttpModule],
})
export class MomoModule {}
