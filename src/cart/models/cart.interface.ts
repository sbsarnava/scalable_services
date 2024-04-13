import { CartItem } from '../entities/cart-item.entity';
import { UserModel } from './user.interface';

export interface CartModel {
    id: number;
    user: UserModel;
    cartItems: CartItem[];
    totalPrice: number;
}
