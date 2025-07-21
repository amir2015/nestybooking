import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Hotel } from './entities/hotel.entity';
import { Repository } from 'typeorm';
import { CreateHotelDto } from './dto/create-hotel.dto';

@Injectable()
export class HotelService {
  constructor(
    @InjectRepository(Hotel)
    private readonly hotelRepository: Repository<Hotel>,
  ) {}

  async findAll(): Promise<Hotel[]> {
    return await this.hotelRepository.find();
  }
  async findOne(id: string): Promise<Hotel> {
    const hotel = await this.hotelRepository.findOne({
      where: { id },
      relations: ['rooms'],
    });
    if (!hotel) {
      throw new NotFoundException('Hotel not found');
    }
    return hotel;
  }
  async create(createHotelDto: CreateHotelDto): Promise<Hotel> {
    const hotel = this.hotelRepository.create(createHotelDto);
    return await this.hotelRepository.save(hotel);
  }
  async search(
    isActive = true,
    city: string,
    minPrice?: number,
    maxPrice?: number,
    minRating?: number,
    amenities?: string[],
  ): Promise<Hotel[]> {
    const queryBuilder = this.hotelRepository
      .createQueryBuilder('hotel')
      .leftJoinAndSelect('hotel.rooms', 'room')
      .where('hotel.city = :city', { city });
    if (isActive !== undefined) {
      queryBuilder.andWhere('hotel.isActive = :isActive', { isActive });
    }
    if (minRating !== undefined) {
      queryBuilder.andWhere('hotel.rating >= :minRating', { minRating });
    }
    if (amenities && amenities.length > 0) {
      for (let i = 0; i < amenities.length; i++) {
        const key = `amenity${i}`;
        queryBuilder.andWhere(`hotel.amenities LIKE :'${key}`, {
          [key]: `%${amenities[i]}%`,
        });
      }
    }
    if (minPrice !== undefined) {
      queryBuilder.andWhere('hotel.price >= :minPrice', { minPrice });
    }
    if (maxPrice !== undefined) {
      queryBuilder.andWhere('hotel.price <= :maxPrice', { maxPrice });
    }

    return await queryBuilder.getMany();
  }
}
