import { Room } from '../../rooms/entities/room.entity';
import { User } from '../../users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('bookings')
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @ManyToOne(() => User, (user) => user.bookings)
  user: User;
  @ManyToOne(() => Room, (room) => room.bookings)
  room: Room;
  @Column()
  checkInDate: Date;

  @Column()
  checkOutDate: Date;

  @Column('decimal')
  totalPrice: number;
  @Column({
    type: 'enum',
    enum: ['pending', 'confirmed', 'cancelled'],
    default: 'pending',
  })
  status: string;
  @Column({ nullable: true })
  paymentId: string;
  @Column({ default: false })
  isPaid: boolean;
  @Column({ nullable: true })
  cancellationReason: string;
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
