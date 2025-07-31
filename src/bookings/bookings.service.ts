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
import { EmailService } from 'src/email/email.service';
import { StripeService } from 'src/payments/stripe.service';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
    private readonly roomsService: RoomsService,
    private readonly emailService: EmailService,
    private readonly stripeService: StripeService,
  ) {}
  async createBooking(createBookingDto: CreateBookingDto, userId: string) {
    const checkIn = new Date(createBookingDto.checkInDate);
    const checkOut = new Date(createBookingDto.checkOutDate);
    if (checkIn >= checkOut) {
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
    const room = await this.roomsService.getRoomById(createBookingDto.roomId);

    const nights =
      Math.ceil(
        (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24),
      ) || 1;
    const totalPriceForBooking = room.pricePerNight * nights;
    if (totalPriceForBooking > 1000000) {
      throw new BadRequestException('Invalid total price for booking');
    }

    const paymentIntent =
      await this.stripeService.createPaymentIntent(totalPriceForBooking);
    if (paymentIntent.status !== 'succeeded') {
      throw new BadRequestException('Payment failed');
    }
    const booking = this.bookingRepository.create({
      ...createBookingDto,
      user: { id: userId },
      paymentIntentId: paymentIntent.id,
      totalPrice: totalPriceForBooking,
      paymentStatus: paymentIntent.status,
      paidAt: paymentIntent.status === 'succeeded' ? new Date() : null,
      isPaid: true,
    });
    await this.bookingRepository.save(booking);
    const finalBooking = await this.bookingRepository.findOne({
      where: { id: booking.id },
      relations: ['room', 'room.hotel', 'user'],
    });
    if (!finalBooking) {
      throw new NotFoundException('Booking not found');
    }

    await this.emailService.sendBookingConfirmation(finalBooking);
    return finalBooking;
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

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }
    if (!booking.user || booking.user.id !== userId) {
      throw new BadRequestException('You can only cancel your own bookings');
    }

    const cancellationAllowed = this.checkCancellationPolicy(booking);
    if (!cancellationAllowed) {
      throw new BadRequestException(
        'Cancellation not allowed within 24 hours of check-in',
      );
    }
    booking.status = 'cancelled';
    const updatedBooking = await this.bookingRepository.save(booking);
    await this.roomsService.updateAvailability(booking.room.id, true);
    await this.emailService.sendCancellationEmail(updatedBooking);
    if (booking.isPaid) {
      await this.stripeService.refundPayment(booking.paymentIntentId);
    }
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
