import { User } from 'src/users/entities/user.entity';
import { Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CartItem } from './cart-item.entity';

@Entity()
export class Cart {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => User, { eager: true })
    @JoinColumn()
    user: User;

    @OneToMany(() => CartItem, (cartItem) => cartItem.cart, { onDelete: 'CASCADE', eager: true })
    cartItems: CartItem[];
}
