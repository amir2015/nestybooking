import { IsString, IsNumber, IsArray, IsUUID } from 'class-validator';

export class CreateRoomDto {
  @IsString()
  roomNumber: string;

  @IsString()
  type: string;

  @IsNumber()
  pricePerNight: number;

  @IsNumber()
  capacity: number;

  @IsArray()
  @IsString({ each: true })
  amenities: string[];

  @IsUUID()
  hotelId: string;
}
