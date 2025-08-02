import { IsString } from 'class-validator';

export class CreateReviewDto {
  @IsString({ message: 'Content must be a string' })
  content: string;
}
