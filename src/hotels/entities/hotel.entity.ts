import { Favorite } from 'src/favorites/entities/favorites.entity';
import { Room } from '../../rooms/entities/room.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

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

  @Column('decimal', { precision: 2, nullable: true })
  rating: number;

  @Column('simple-array')
  amenities: string[];
  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Room, (room) => room.hotel)
  rooms: Room[];

  @OneToMany(() => Favorite, (favorite) => favorite.hotel)
  favorites: Favorite[];
}
