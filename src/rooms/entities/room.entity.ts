// src/rooms/entities/room.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { Hotel } from '../../hotels/entities/hotel.entity';
import { Booking } from 'src/bookings/entities/booking.entity';

@Entity('rooms')
export class Room {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  roomNumber: string;

  @Column()
  type: string;

  @Column('decimal')
  pricePerNight: number;

  @Column()
  capacity: number;

  @Column('simple-array')
  amenities: string[];

  @Column({ default: true })
  isAvailable: boolean;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;

  @ManyToOne(() => Hotel, (hotel) => hotel.rooms)
  hotel: Hotel;
  @OneToMany(() => Booking, (booking) => booking.room)
  bookings: Booking[];
}
