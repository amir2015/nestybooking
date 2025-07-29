import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';

@Controller('booking')
@UseGuards(JwtAuthGuard)
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}
  @Post()
  async createBooking(
    @Body() createBookingDto: CreateBookingDto,
    @Request() req: any,
  ) {
    return await this.bookingsService.createBooking(
      createBookingDto,
      req.user.id,
    );
  }
  @Get()
  async getMyBookings(@Request() req: any) {
    return await this.bookingsService.getBookings(req.user.id);
  }
  @Post(':id/cancel')
  async cancelBooking(@Request() req: any, @Param('id') bookingId: string) {
    return await this.bookingsService.cancelBooking(
      bookingId,
      req.user.id,
    );
  }
}
