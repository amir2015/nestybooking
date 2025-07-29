import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { HotelsService } from './hotels.service';
import { CreateHotelDto } from './dto/create-hotel.dto';
import { AuthGuard } from '@nestjs/passport';
import { RoleGuard } from 'src/auth/guards/roles.guard';
import { Role } from 'src/auth/roles.enum';
import { Roles } from 'src/auth/decorators/roles.decorator';

@Controller('hotels')
export class HotelsController {
  constructor(private readonly hotelsService: HotelsService) {}
  @Post()
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Roles(Role.ADMIN)
  async createHotel(@Body() createHotelDto: CreateHotelDto) {
    return await this.hotelsService.create(createHotelDto);
  }
  @Get()
  async findAll() {
    return await this.hotelsService.findAll();
  }
  @Get('search')
  async searchHotels(
    @Body('isActive') isActive: boolean,
    @Body('city') city: string,
    @Body('minPrice') minPrice?: number,
    @Body('maxPrice') maxPrice?: number,
    @Body('minRating') minRating?: number,
    @Body('amenities') amenities?: string[],
  ) {
    return await this.hotelsService.search(
      isActive,
      city,
      minPrice,
      maxPrice,
      minRating,
      amenities,
    );
  }
}
