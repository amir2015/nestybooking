import { Type } from 'class-transformer';
import { IsDate, IsOptional } from 'class-validator';

export class ModifyBookingDto {
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  newCheckInDate?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  newCheckOutDate?: Date;
}
