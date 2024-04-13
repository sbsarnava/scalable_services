import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Product {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    productName: string;

    @Column()
    costPrice: number;

    @Column()
    sellingPrice: number;

    @Column()
    quantityAvailable: number;

    @Column()
    category: string;

    @Column()
    description: string;
}
