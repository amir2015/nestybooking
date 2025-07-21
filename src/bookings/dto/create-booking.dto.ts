import { IsDate, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateBookingDto {
  @IsUUID()
  roomId: string;

  @Type(() => Date)
  @IsDate()
  checkInDate: Date;

  @Type(() => Date)
  @IsDate()
  checkOutDate: Date;
}
