import { InjectRepository } from '@nestjs/typeorm';
import { CartItem } from './entities/cart-item.entity';
import { Repository } from 'typeorm';
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { ProductsService } from 'src/products/products.service';
import { ProductAddToCartDTO } from './dto/product-add-to-cart.dto';

@Injectable()
export class CartItemService {
    constructor(@InjectRepository(CartItem) private cartItemRepo: Repository<CartItem>, private productsService: ProductsService) {}
    
    async create(productAddToCartDTO: ProductAddToCartDTO): Promise<CartItem> {
        const product = await this.productsService.findOne(productAddToCartDTO.productId);
        if (!product) {
            throw new NotFoundException('Product Not Found');
        }
        if (productAddToCartDTO.quantity > product.quantityAvailable) {
            throw new BadRequestException('Please add less than the quantity available');
        }
        let cartItem = await this.cartItemRepo.findOne({ where: { product: product } });
        if (cartItem) {
            cartItem.quantity = productAddToCartDTO.quantity;
            return this.cartItemRepo.save(cartItem);
        } else {
            cartItem = this.cartItemRepo.create({ product: product, quantity: productAddToCartDTO.quantity });
            return this.cartItemRepo.save(cartItem);
        }
    }

    async remove(cartItemId: number) {
        const cartItem = await this.cartItemRepo.findOne({ where: { id: cartItemId } });
        if (!cartItem) {
            throw new NotFoundException('Cart Item not Found');
        }
        return this.cartItemRepo.remove(cartItem);
    }

    save(cartItem: CartItem) {
        return this.cartItemRepo.save(cartItem);
    }
}
