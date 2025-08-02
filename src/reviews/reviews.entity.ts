import { Hotel } from 'src/hotels/entities/hotel.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('reviews')
export class Review {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ type: 'text' })
  content: string;
  @Column()
  createdAt: Date;
  @ManyToOne(() => User)
  user: User;
  @ManyToOne(() => Hotel)
  hotel: Hotel;
  @Column()
  userId: string;
  @Column()
  hotelId: string;

}
