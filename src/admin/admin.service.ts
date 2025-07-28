import { Injectable } from '@nestjs/common';

@Injectable()
export class AdminService {
  constructor() {}

  // Example method to get admin dashboard data
  getDashboardData() {
    console.log('Fetching admin dashboard data');
  }
}
