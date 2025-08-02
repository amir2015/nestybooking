import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from './reviews.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
  ) {}
  async createReview(
    hotelId: string,
    userId: string,
    content: string,
  ): Promise<Review> {
    const newReview = this.reviewRepository.create({
      content,
      userId,
      hotelId,
    });
    newReview.createdAt = new Date();
    return await this.reviewRepository.save(newReview);
  }
  async deleteReview(reviewId: string, userId: string): Promise<void> {
    const review = await this.reviewRepository.findOne({
      where: { id: reviewId, userId },
    });
    if (!review) {
      throw new Error('Review not found or does not belong to the user');
    }
    await this.reviewRepository.delete(reviewId);
  }
}
