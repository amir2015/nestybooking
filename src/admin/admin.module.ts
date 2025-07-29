import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from '../bookings/entities/booking.entity';
import { Hotel } from 'src/hotels/entities/hotel.entity';
import { User } from 'src/users/entities/user.entity';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Booking, Hotel])],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
