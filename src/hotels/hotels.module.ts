import { Module } from '@nestjs/common';
import { Hotel } from './entities/hotel.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HotelsController } from './hotels.controller';
import { HotelsService } from './hotels.service';
import { Review } from 'src/reviews/reviews.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Hotel, Review])],
  controllers: [HotelsController],
  providers: [HotelsService],
  exports: [HotelsService],
})
export class HotelsModule {}
