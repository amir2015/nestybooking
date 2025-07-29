import { Controller, Get, Param, Put, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RoleGuard } from 'src/auth/guards/roles.guard';
import { Role } from '../auth/roles.enum';
import { AdminService } from './admin.service';

@Controller('admin')
@UseGuards(AuthGuard('jwt'), RoleGuard)
@Roles(Role.ADMIN)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}
  @Get('reports/revenue')
  async getRevenueReport(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    // return await this.adminService.getRevenueReport();
  }
  @Get('dashboard')
  async getDashboardData() {
    return await this.adminService.getDashboardData();
  }
  @Get('users')
  async getUsers(@Query('page') page = 1, @Query('limit') limit = 10) {
    return await this.adminService.getUsers(page, limit);
  }
  @Get('bookings/:id')
  async getSingleBooking(@Param('id') id: string) {
    return await this.adminService.getSingleBooking(id);
  }
  @Get('bookings')
  async getAllBookings(
    @Query('status') status?: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
     return await this.adminService.getAllBookings(status, page, limit);
  }
  @Put('users/:id/toggle-status')
  async toggleUserStatus(@Param('id') id: string) {
     return await this.adminService.toggleUserStatus(id);
  }
}
