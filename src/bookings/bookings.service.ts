import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Booking } from './entities/booking.entity';
import { Repository } from 'typeorm';
import { CreateBookingDto } from './dto/create-booking.dto';
import { RoomsService } from '../rooms/rooms.service';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
    private readonly roomsService: RoomsService,
  ) {}
  async createBooking(
    createBookingDto: CreateBookingDto,
    userId: string,
  ): Promise<Booking> {
    if (
      new Date(createBookingDto.checkInDate) >=
      new Date(createBookingDto.checkOutDate)
    ) {
      throw new BadRequestException(
        'Check-out date must be after check-in date',
      );
    }
    const isAvailable = await this.roomsService.checkRoomAvailability(
      createBookingDto.roomId,
      createBookingDto.checkInDate,
      createBookingDto.checkOutDate,
    );
    if (!isAvailable) {
      throw new BadRequestException(
        'Room is not available for the selected dates',
      );
    }

    const booking = this.bookingRepository.create({
      ...createBookingDto,
      user: { id: userId },
    });
    const savedBooking = await this.bookingRepository.save(booking);
    return { id: savedBooking.id, ...savedBooking };
  }
  async getBookings(userId: string): Promise<Booking[]> {
    return this.bookingRepository.find({
      where: { id: userId },
      relations: ['room', 'room.hotel'],
      order: { createdAt: 'DESC' },
    });
  }
  async getBookingById(bookingId: string): Promise<Booking> {
    return this.bookingRepository.findOne({
      where: { id: bookingId },
      relations: ['room', 'room.hotel', 'user'],
    });
  }
  async cancelBooking(bookingId: string, userId: string) {
    const booking = await this.getBookingById(bookingId);
    console.log('Booking:', booking);
    if (!booking) {
      throw new NotFoundException('Booking not found');
    }
    if (!booking.user || booking.user.id !== userId) {
      throw new BadRequestException('You can only cancel your own bookings');
    }
    console.log('Booking User ID:', booking.user.id);
    const cancellationAllowed = this.checkCancellationPolicy(booking);
    if (!cancellationAllowed) {
      throw new BadRequestException(
        'Cancellation not allowed within 24 hours of check-in',
      );
    }
    booking.status = 'cancelled';
    const updatedBooking = await this.bookingRepository.save(booking);
    await this.roomsService.updateAvailability(booking.room.id, true);
    console.log('Updated Booking:', updatedBooking);
    console.log(booking.roomId);
    console.log(booking.room.id);

    return updatedBooking;
  }
  private checkCancellationPolicy(booking: Booking): boolean {
    const today = new Date();
    const checkIn = new Date(booking.checkInDate);
    const hoursUntillCheckIn =
      (checkIn.getTime() - today.getTime()) / 1000 / 60 / 60;
    if (hoursUntillCheckIn < 24) {
      return false;
    }
    return true;
  }
}
