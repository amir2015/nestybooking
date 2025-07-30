import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { ModifyBookingDto } from './dto/modify-booking.dto';
import { ModifyBookingService } from './bookingModification.service';
import { ModifyBookingResult } from './modifyBookingResult.interface';

@Controller('booking')
@UseGuards(JwtAuthGuard)
export class BookingsController {
  constructor(
    private readonly bookingsService: BookingsService,
    private readonly ModifyBookingService: ModifyBookingService,
  ) {}
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
    return await this.bookingsService.cancelBooking(bookingId, req.user.id);
  }
  @Put(':id/modify')
  async modifyBooking(
    @Request() req: any,
    @Param('id') bookingId: string,
    @Body() modifyBookingDto: ModifyBookingDto,
  ): Promise<ModifyBookingResult> {
    return await this.ModifyBookingService.modifyBooking(
      bookingId,
      req.user.id,
      modifyBookingDto,
    );
  }
}
