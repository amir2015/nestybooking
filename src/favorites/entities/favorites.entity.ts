import { Hotel } from 'src/hotels/entities/hotel.entity';
import { User } from 'src/users/entities/user.entity';
import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Favorites')
export class Favorite {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @ManyToOne(() => Hotel, (hotel) => hotel.favorites)
  hotel: Hotel;
  @ManyToOne(() => User, (user) => user.favorites)
  user: User;
}
