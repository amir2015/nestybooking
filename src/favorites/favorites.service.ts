import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Favorite } from './entities/favorites.entity';
import { Repository } from 'typeorm';
import { Hotel } from 'src/hotels/entities/hotel.entity';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectRepository(Favorite)
    private favoriteRepository: Repository<Favorite>,
    @InjectRepository(Hotel)
    private hotelRepository: Repository<Hotel>,
  ) {}
  async addFavorite(userId: string, hotelId: string): Promise<Favorite> {
    const existingFavorite = await this.favoriteRepository.findOne({
      where: { user: { id: userId }, hotel: { id: hotelId } },
    });
    if (existingFavorite) {
      return existingFavorite;
    }

    const newFavorite = this.favoriteRepository.create({
      user: { id: userId },
      hotel: { id: hotelId },
    });

    return await this.favoriteRepository.save(newFavorite);
  }
  async removeFavorite(userId: string, hotelId: string) {
    const existingFavorite = await this.favoriteRepository.findOne({
      where: { user: { id: userId }, hotel: { id: hotelId } },
    });
    if (existingFavorite) {
      await this.favoriteRepository.remove(existingFavorite);
      return { message: 'Favorite removed successfully' };
    } else {
      throw new NotFoundException('Favorite not found');
    }
  }
  async getFavoritesByUserId(userId: string): Promise<Hotel[]> {
    const favorites = await this.favoriteRepository.find({
      where: { user: { id: userId } },
      relations: ['hotel'],
    });
    if (!favorites || favorites.length === 0) {
      throw new NotFoundException('No favorites found for this user');
    }
    return favorites.map((fav) => fav.hotel);
  }
}
