import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Booking } from 'src/bookings/entities/booking.entity';
import { Repository } from 'typeorm';
import { StripeService } from './stripe.service';

@Injectable()
export class PaymentsTrackingService {
  constructor(
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
    private readonly stripeService: StripeService,
  ) {}
  async checkPaymentStatus(bookingId: string): Promise<string> {
    const booking = await this.bookingRepository.findOne({
      where: { id: bookingId },
    });
    if (!booking) {
      throw new NotFoundException('Booking not found');
    }
    if (!booking.paymentIntentId) {
      throw new NotFoundException('Payment intent not found for this booking');
    }
    const paymentIntent = await this.stripeService.retrievePaymentIntent(
      booking.paymentIntentId,
    );
    return paymentIntent.status;
  }
}
