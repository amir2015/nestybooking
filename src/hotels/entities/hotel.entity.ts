import { Room } from 'src/rooms/entities/room.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('hotels')
export class Hotel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  address: string;

  @Column()
  city: string;

  @Column('text')
  description: string;

  @Column('decimal', { precision: 2 })
  rating: number;

  @Column('simple-array')
  amenities: string[];
  @Column({ default: true })
  isActive: boolean;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;
  @OneToMany(() => Room, (room) => room.hotel)
  rooms: Room[];
}
