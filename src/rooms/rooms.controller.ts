import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { RoleGuard } from 'src/auth/guards/roles.guard';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/roles.enum';
import { CreateRoomDto } from './dto/create-room.dto';

@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}
  @Post()
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Roles(Role.ADMIN)
  async createRoom(@Body() createRoomDto: CreateRoomDto) {
    const room = await this.roomsService.create(createRoomDto);
    return room;
  }
  @Get('available/:hotelId')
  async findAvailableRooms(
    @Param('hotelId') hotelId: string,
    @Body('startDate') startDate: Date,
    @Body('endDate') endDate: Date,
  ) {
    const availableRooms = await this.roomsService.findAvailableRooms(
      hotelId,
      new Date(startDate),
      new Date(endDate),
    );
    return availableRooms;
  }
}
