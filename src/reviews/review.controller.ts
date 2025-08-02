import {
  Body,
  Controller,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dtos/createReview.dto';

@Controller('reviews')
@UseGuards(JwtAuthGuard)
export class ReviewController {
  constructor(private readonly reviewsService: ReviewsService) {}
  @Post(':hotelId')
  async createReview(
    @Param('hotelId') hotelId: string,
    @Body() createReviewDto: CreateReviewDto,
    @Request()
    req: any,
  ) {
    return await this.reviewsService.createReview(
      hotelId,
      req.user.id,
      createReviewDto.content,
    );
  }
  @Post('delete/:reviewId')
  async deleteReview(@Param('reviewId') reviewId: string, @Request() req: any) {
    return await this.reviewsService.deleteReview(reviewId, req.user.id);
  }
}
