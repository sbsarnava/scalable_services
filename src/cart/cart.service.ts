import { BadRequestException, Injectable, NotFoundException, UseInterceptors } from '@nestjs/common';
import { UpdateCartDto } from './dto/update-cart.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { Repository } from 'typeorm';
import { ProductAddToCartDTO } from './dto/product-add-to-cart.dto';
import { CartItemService } from './cart-item.service';
import { UserJWT } from 'src/models/user-jwt.model';
import { UsersService } from 'src/users/users.service';
import { ProductsService } from 'src/products/products.service';
import { CartModel } from './models/cart.interface';
import { CartItem } from './entities/cart-item.entity';

@Injectable()
export class CartService {
    constructor(
        @InjectRepository(Cart) private cartRepo: Repository<Cart>,
        private cartItemService: CartItemService,
        private userService: UsersService,
        private productsService: ProductsService,
    ) {}

    async addToCart(productAddToCartDTO: ProductAddToCartDTO, userJWT: UserJWT) {
        let cart = await this.cartRepo.findOne({ where: { user: { id: userJWT.userId } } });

        if (cart) {
            const isCartItemPresentInCartIndex = cart.cartItems.findIndex(
                (cartItem) => cartItem.product.id === productAddToCartDTO.productId,
            );
            if (isCartItemPresentInCartIndex !== -1) {
                cart.cartItems[isCartItemPresentInCartIndex].quantity = productAddToCartDTO.quantity;
            } else {
                let cartItem = await this.cartItemService.create(productAddToCartDTO);
                cart.cartItems.push(cartItem);
            }
            return this.cartRepo.save(cart);
        } else {
            let user = await this.userService.findOne(userJWT.userId);
            let cartItem = await this.cartItemService.create(productAddToCartDTO);
            cart = this.cartRepo.create({ user: user, cartItems: [cartItem] });
            return this.cartRepo.save(cart);
        }
    }

    async updateCart(user: UserJWT, updateCartDto: UpdateCartDto) {
        const product = await this.productsService.findOne(updateCartDto.productId);
        if (!product) {
            throw new NotFoundException('Product Not found');
        }
        const cartUser = await this.userService.findOne(user.userId);
        const cart = await this.cartRepo.findOne({ where: { user: cartUser } });
        if (!cart) {
            throw new NotFoundException('There is no cart associated with the user');
        }
        const cartItem = cart.cartItems.find((item) => item.product.id === updateCartDto.productId);
        if (!cartItem) {
            throw new NotFoundException('Product is not added to cart');
        }
        const indexOfCartItem = cart.cartItems.indexOf(cart.cartItems.find((item) => item.id === cartItem.id));
        const quantityToBeUpdated = cart.cartItems[indexOfCartItem].quantity + updateCartDto.quantity;
        if (quantityToBeUpdated <= product.quantityAvailable) {
            cartItem.quantity += updateCartDto.quantity;
        } else {
            throw new BadRequestException('Please add less than the quantity available');
        }
        return this.cartItemService.save(cartItem);
    }

    async displayCart(user: UserJWT): Promise<CartModel> {
        const userEntity = await this.userService.findOne(user.userId);
        const cart = await this.cartRepo.findOne({
            where: { user: userEntity },
        });
        if (!cart) {
            throw new NotFoundException('Cart was not found');
        }
        // Calculating total price
        const totalPrice = this.totalPrice(cart.cartItems);
        return { ...cart, totalPrice };
    }

    async deleteCart(user: UserJWT) {
        const userEntity = await this.userService.findOne(user.userId);
        const cart = await this.cartRepo.find({ where: { user: userEntity } });
        if (!cart) {
            throw new NotFoundException('Cart was not found');
        }
        return this.cartRepo.remove(cart);
    }

    deleteCartItem(cartItemId: number) {
        return this.cartItemService.remove(cartItemId);
    }

    //Util Function
    totalPrice(cartItem: CartItem[]): number {
        const quantityMat = cartItem.flatMap((item) => item.quantity);
        const sellingPriceMap = cartItem.map((product) => product.product.sellingPrice);
        let totalPrice = 0;
        for (let i = 0; i < quantityMat.length; i++) {
            totalPrice += quantityMat[i] * sellingPriceMap[i];
        }
        return totalPrice;
    }
}
