import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CartModule } from './cart/cart.module';
import { ProductsModule } from './products/products.module';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entities/user.entity';
import { Product } from './products/entities/product.entity';
import { Cart } from './cart/entities/cart.entity';
import { CartItem } from './cart/entities/cart-item.entity';
import { UtilService } from './util/util.service';
import { JWT_SECRET } from 'env';
import { JwtModule } from '@nestjs/jwt';

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'sqlite',
            entities: [User, Product, Cart, CartItem],
            database: 'e_commerce.sqlite',
            synchronize: true,
        }),
        UsersModule,
        ProductsModule,
        CartModule,
        JwtModule.register({
            global: true,
            secret: JWT_SECRET,
            signOptions: { expiresIn: '24h' },
        }),
    ],
    controllers: [AppController],
    providers: [AppService, UtilService],
})
export class AppModule {}
