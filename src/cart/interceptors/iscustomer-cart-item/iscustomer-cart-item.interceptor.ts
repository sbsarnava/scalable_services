import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { CartItem } from 'src/cart/entities/cart-item.entity';

@Injectable()
export class IscustomerCartItemInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        return next.handle().pipe(
            map((cartItem: CartItem) => {
                delete cartItem.product.costPrice;
                return cartItem;
            }),
        );
    }
}
