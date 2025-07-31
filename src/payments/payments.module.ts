import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from 'src/bookings/entities/booking.entity';
import { StripeService } from './stripe.service';

@Module({
  imports: [TypeOrmModule.forFeature([Booking])],
  providers: [StripeService],
  exports: [StripeService],
})
export class PaymentsModule {}
