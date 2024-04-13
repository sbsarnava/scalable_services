import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart-item.entity';
import { CartItemService } from './cart-item.service';
import { ProductsModule } from 'src/products/products.module';
import { UsersModule } from 'src/users/users.module';
import { UtilService } from 'src/util/util.service';
import { IsCustGuard } from 'src/guards/iscust/iscust.guard';
import { AuthGuard } from 'src/guards/auth/auth.guard';

@Module({
    imports: [TypeOrmModule.forFeature([Cart, CartItem]), ProductsModule, UsersModule],
    controllers: [CartController],
    providers: [CartService, CartItemService, UtilService, IsCustGuard, AuthGuard],
})
export class CartModule {}
