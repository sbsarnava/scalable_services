import { IsNumber } from 'class-validator';

export class ProductAddToCartDTO  {
    @IsNumber()
    productId: number;

    @IsNumber()
    quantity: number;
}
