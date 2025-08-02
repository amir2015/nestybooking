import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewController } from './review.controller';
import { ReviewsService } from './reviews.service';
import { Review } from './reviews.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Review])],
  providers: [ReviewsService],
  controllers: [ReviewController],
  exports: [ReviewsService],
})
export class ReviewsModule {}
