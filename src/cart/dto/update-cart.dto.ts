import { PartialType } from '@nestjs/mapped-types';
import { IsNumber } from 'class-validator';
import { ProductAddToCartDTO } from './product-add-to-cart.dto';

export class UpdateCartDto extends PartialType(ProductAddToCartDTO) {}
