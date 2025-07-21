import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Exclude } from 'class-transformer';
import { Booking } from "src/bookings/entities/booking.entity";

@Entity("users")
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    email: string;

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
