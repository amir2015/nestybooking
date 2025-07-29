import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';
import { Role } from '../auth/roles.enum';
import dataSource from '../database/data-source';

async function createAdmin() {
  try {
    await dataSource.initialize();
    const userRepository = dataSource.getRepository(User);

    const existingAdmin = await userRepository.findOne({
      where: { email: 'admin2@example.com' },
    });

    if (existingAdmin) {
      console.log('Admin user already exists');
      return;
    }

    const admin = userRepository.create({
      email: 'admin2@example.com',
      password: await bcrypt.hash(
        process.env.DEFAULT_ADMIN_PASSWORD || 'securepassword123',
        10,
      ),
      role: Role.ADMIN,
    });

    await userRepository.save(admin);
    console.log('Admin user created successfully');
  } catch (error) {
    console.error('Error creating admin:', error);
  } finally {
    await dataSource.destroy();
  }
}

createAdmin();
