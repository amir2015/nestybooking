import { Injectable } from "@nestjs/common";

@Injectable()
export class AdminService {
    constructor() {
        
    }

    // Example method to get admin dashboard data
    getDashboardData() {
        return {
        message: "Admin dashboard data",
        timestamp: new Date(),
        };
    }

    // Add more methods as needed for admin functionalities
}
