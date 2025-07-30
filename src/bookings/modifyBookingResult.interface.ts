import { Booking } from "./entities/booking.entity";

export interface ModifyBookingResult {
    updatedBooking: Booking;
    message: string;
  }
