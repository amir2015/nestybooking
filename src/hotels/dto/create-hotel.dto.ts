import { IsNumber, IsString, Max, Min } from 'class-validator';

export class CreateHotelDto {
  @IsString()
  name: string;
  @IsString()
  address: string;
  @IsString()
  city: string;
  @IsString()
  country: string;
  @IsNumber()
  @Min(0)
  @Max(5)
  stars: number;
  @IsString()
  description?: string;
  @IsString()
  phone?: string;
  @IsString()
  email?: string;
  @IsString()
  website?: string;
}
