import { IsNumber, IsString } from 'class-validator';

export class CreateProductDto {
    @IsString()
    productName: string;

    @IsNumber()
    costPrice: number;

    @IsNumber()
    sellingPrice: number;

    @IsNumber()
    quantityAvailable: number;

    @IsString()
    category: string;

    @IsString()
    description: string;
}
