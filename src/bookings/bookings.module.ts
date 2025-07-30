import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from './entities/booking.entity';
import { RoomsModule } from 'src/rooms/rooms.module';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { ModifyBookingService } from './bookingModification.service';

@Module({
  imports: [TypeOrmModule.forFeature([Booking]), RoomsModule],
  controllers: [BookingsController],
  providers: [BookingsService, ModifyBookingService],
  exports: [BookingsService],
})
export class BookingsModule {}
