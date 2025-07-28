import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Booking } from '../../bookings/entities/booking.entity';
import { Role } from '../../auth/roles.enum';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;
  @Column({ nullable: true })
  name: string;
  @Column({ nullable: true })
  phone: string;
  @Column({
    type: 'enum',
    enum: Role,
    default: Role.USER,
  })
  role: Role;
  @Column()
  @Exclude()
  password: string;

  @OneToMany(() => Booking, (booking) => booking.user)
  bookings: Booking[];
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
