import { Product } from 'src/products/entities/product.entity';
import { Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn, ManyToOne, Column } from 'typeorm';
import { Cart } from './cart.entity';

@Entity()
export class CartItem {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => Product, {eager: true})
    @JoinColumn()
    product: Product;

    @Column()
    quantity: number;

    @ManyToOne(() => Cart, (cart) => cart.cartItems, {onDelete: "CASCADE"})
    cart: Cart;
}
