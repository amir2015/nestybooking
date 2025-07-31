import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Room } from './entities/room.entity';
import { Repository } from 'typeorm';
import { CreateRoomDto } from './dto/create-room.dto';
import { Booking } from 'src/bookings/entities/booking.entity';

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,
    @InjectRepository(Booking)
    private readonly bookingsRepository: Repository<Booking>,
  ) {}
  async create(createRoomDto: CreateRoomDto): Promise<Room> {
    const room = this.roomRepository.create(createRoomDto);
    return this.roomRepository.save(room);
  }
  async findAvailableRooms(
    hotelId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<Room[]> {
    return this.roomRepository
      .createQueryBuilder('room')
      .leftJoin('room.bookings', 'booking')
      .where('room.hotelId = :hotelId', { hotelId })
      .andWhere('room.isAvailable = :isAvailable', { isAvailable: true })
      .andWhere(
        '(booking.id IS NULL OR NOT (' +
          'booking.checkInDate <= :endDate AND ' +
          'booking.checkOutDate >= :startDate))',
        { startDate, endDate },
      )
      .getMany();
  }
  async updateAvailability(
    roomId: string,
    isAvailable: boolean,
  ): Promise<Room> {
    const room = await this.roomRepository.findOne({ where: { id: roomId } });
    if (!room) {
      throw new NotFoundException('Room not found');
    }
    room.isAvailable = isAvailable;
    return await this.roomRepository.save(room);
  }
  async checkRoomAvailability(
    roomId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<boolean> {
    const room = await this.roomRepository.findOne({ where: { id: roomId } });
    if (!room) {
      throw new NotFoundException('Room not found');
    }

    const overLappingBookings = await this.bookingsRepository
      .createQueryBuilder('booking')
      .where('booking.roomId = :roomId', { roomId })
      .andWhere(
        'booking.checkInDate < :endDate AND booking.checkOutDate > :startDate',
        { endDate, startDate },
      )
      .getCount();
    return overLappingBookings === 0;
  }
  async getRoomById(roomId: string): Promise<Room> {
    const room = await this.roomRepository.findOne({
      where: { id: roomId },
      relations: ['hotel'],
    });
    if (!room) {
      throw new NotFoundException('Room not found');
    }
    return room;
  }
}
