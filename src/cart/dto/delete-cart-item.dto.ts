import { IsNumber } from 'class-validator';

export class DeleteCartitem {
    @IsNumber()
    cartItemId: number;
}
