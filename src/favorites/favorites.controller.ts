import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { FavoritesService } from './favorites.service';

@Controller('favorites')
@UseGuards(JwtAuthGuard)
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}
  @Post(':hotelId')
  async addFavorite(@Param('hotelId') hotelId: string, @Request() req: any) {
    return await this.favoritesService.addFavorite(req.user.id, hotelId);
  }
  @Delete('remove/:hotelId')
  async removeFavorite(@Param('hotelId') hotelId: string, @Request() req: any) {
    return await this.favoritesService.removeFavorite(req.user.id, hotelId);
  }
  @Get()
  async getFavoritesByUser(@Request() req) {
    return await this.favoritesService.getFavoritesByUserId(req.user.id);
  }
}
