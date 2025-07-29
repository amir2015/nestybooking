import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Booking } from 'src/bookings/entities/booking.entity';
import { Hotel } from 'src/hotels/entities/hotel.entity';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Hotel)
    private readonly hotelRepository: Repository<Hotel>,
  ) {}

  async getDashboardData() {
    const [
      totalBookings,
      totalUsers,
      totalHotels,
      recentBookings,
      recentUsers,
      recentHotels,
    ] = await Promise.all([
      this.bookingRepository.count(),
      this.userRepository.count(),
      this.hotelRepository.count(),
      this.bookingRepository.find({
        order: { createdAt: 'DESC' },
        take: 5,
        relations: ['user', 'hotel'],
      }),
      this.userRepository.find({
        order: { createdAt: 'DESC' },
        take: 5,
      }),
      this.hotelRepository.find({
        order: { createdAt: 'DESC' },
        take: 5,
      }),
    ]);

    return {
      totalBookings,
      totalUsers,
      totalHotels,
      recentBookings,
      recentUsers,
      recentHotels,
    };
  }
  async getAllBookings(status?: string, page = 1, limit = 10) {
    const query = this.bookingRepository
      .createQueryBuilder('booking')
      .leftJoinAndSelect('booking.user', 'user')
      .leftJoinAndSelect('booking.hotel', 'hotel')
      .orderBy('booking.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    if (status) {
      query.where('booking.status = :status', { status });
    }

    const [bookings, total] = await query.getManyAndCount();

    return {
      bookings,
      total,
      page,
      limit,
    };
  }

  async getSingleBooking(id: string) {
    return this.bookingRepository.findOne({
      where: { id },
      relations: ['user', 'hotel'],
    });
  }

  async getUsers(page = 1, limit = 10) {
    const [users, total] = await this.userRepository.findAndCount({
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return {
      users,
      total,
      page,
      limit,
    };
  }

  async toggleUserStatus(id: string) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    user.isActive = !user.isActive;
    return this.userRepository.save(user);
  }
}
