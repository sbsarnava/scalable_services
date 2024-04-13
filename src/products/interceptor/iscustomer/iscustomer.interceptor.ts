import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { USER_ROLE } from 'src/models/user-jwt.model';
import { Product } from 'src/products/entities/product.entity';
import { UtilService } from 'src/util/util.service';

@Injectable()
export class IscustomerInterceptor implements NestInterceptor {
    constructor(private utilService: UtilService) {}
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        return next.handle().pipe(
            map((data) => {
                const user = this.utilService.getUserFromContext(context);
                if (user?.role == USER_ROLE.customer) {
                    if (Array.isArray(data)) {
                        data.map((item: Product) => delete item.costPrice);
                    } else {
                        delete data.costPrice;
                    }
                    return data;
                } else {
                    return data;
                }
            }),
        );
    }
}
