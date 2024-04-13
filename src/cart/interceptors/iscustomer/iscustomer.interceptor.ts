import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { CartModel } from 'src/cart/models/cart.interface';
import { USER_ROLE } from 'src/models/user-jwt.model';
import { UtilService } from 'src/util/util.service';

@Injectable()
export class IscustomerCartInterceptor implements NestInterceptor {
    constructor(private utilService: UtilService) {}
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        return next.handle().pipe(
            map((data: CartModel) => {
                const user = this.utilService.getUserFromContext(context);
                if (user.role === USER_ROLE.customer) {
                    data.cartItems.map((item) => {
                        return delete item.product.costPrice;
                    });
                }
                return data;
            }),
        );
    }
}
