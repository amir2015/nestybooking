import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Booking } from './entities/booking.entity';
import { Repository } from 'typeorm';
import { RoomsService } from '../rooms/rooms.service';
import { ModifyBookingDto } from './dto/modify-booking.dto';
import { ModifyBookingResult } from './modifyBookingResult.interface';

@Injectable()
export class ModifyBookingService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
    private readonly roomsService: RoomsService,
  ) {}
  async modifyBooking(
    bookingId: string,
    userId: string,
    bookingModifications: ModifyBookingDto,
  ): Promise<ModifyBookingResult> {
    const booking = await this.bookingRepository.findOne({
      where: { id: bookingId },
      relations: ['room', 'user'],
    });
    if (!booking) {
      throw new NotFoundException('Booking not found');
    }
    if (!booking.user || booking.user.id !== userId) {
      throw new BadRequestException('You can only modify your own bookings');
    }
    if (!(booking.status === 'confirmed' || booking.status === 'pending')) {
      throw new BadRequestException(
        'Invalid booking status, your booking is not confirmed yet',
      );
    }
    if (!this.canModifyBooking(booking)) {
      throw new BadRequestException('Cannot modify booking within 24 hours');
    }
    const isAvailable = await this.roomsService.checkRoomAvailability(
      booking.roomId,
      bookingModifications.newCheckInDate || booking.checkInDate,
      bookingModifications.newCheckOutDate || booking.checkOutDate,
    );
    if (!isAvailable) {
      throw new BadRequestException(
        'Room is not available for the selected dates',
      );
    }
    const priceDifference = await this.calculatePriceDifference(
      booking,
      bookingModifications,
    );

    const updatedBooking = await this.bookingRepository.save({
      ...booking,
      checkInDate: bookingModifications.newCheckInDate || booking.checkInDate,
      checkOutDate:
        bookingModifications.newCheckOutDate || booking.checkOutDate,
      price: booking.totalPrice + priceDifference,
    });
    return {
      message: 'Your booking has been modified successfully',
      updatedBooking,
    };
  }
  private canModifyBooking(booking: Booking): boolean {
    const currentDate = new Date();
    const bookingDate = new Date(booking.checkInDate);
    const hoursUntilCheckIn =
      (bookingDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60);
    return hoursUntilCheckIn >= 24;
  }
  private async calculatePriceDifference(
    booking: Booking,
    modifications: ModifyBookingDto,
  ): Promise<number> {
    const currentNights = this.calculateNights(
      booking.checkInDate,
      booking.checkOutDate,
    );
    const newNights = this.calculateNights(
      modifications.newCheckInDate || booking.checkInDate,
      modifications.newCheckOutDate || booking.checkOutDate,
    );
    const priceDifference =
      (newNights - currentNights) * booking.room.pricePerNight;
    return priceDifference;
  }
  private calculateNights(checkInDate: Date, checkOutDate: Date): number {
    return Math.ceil(
      (new Date(checkOutDate).getTime() - new Date(checkInDate).getTime()) /
        (1000 * 60 * 60 * 24),
    );
  }
}
