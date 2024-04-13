import { IsString } from 'class-validator';

export class ProductCategorySearchDTO {
    @IsString()
    category: string;
}
