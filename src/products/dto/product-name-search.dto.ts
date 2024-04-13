import { IsString } from 'class-validator';

export class ProductNameSearchDTO {
    @IsString()
    productName: string;
}
