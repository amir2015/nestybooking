import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Favorite } from './entities/favorites.entity';
import { FavoritesController } from './favorites.controller';
import { FavoritesService } from './favorites.service';
import { Hotel } from 'src/hotels/entities/hotel.entity';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Favorite, User, Hotel])],
  controllers: [FavoritesController],
  providers: [FavoritesService],
  exports: [],
})
export class FavoritesModule {}
