import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ProductsService {
    constructor(@InjectRepository(Product) private productRepo: Repository<Product>) {}

    create(createProductDto: CreateProductDto): Promise<Product> | Promise<null> {
        const product = this.productRepo.create(createProductDto);
        if (!product) {
            throw new BadRequestException("Couldn't create product");
        }
        return this.productRepo.save(product);
    }

    findAll(): Promise<Product[]> | Promise<null> {
        return this.productRepo.find();
    }

    findOne(id: number): Promise<Product> | Promise<null> {
        return this.productRepo.findOne({ where: { id } });
    }

    async update(id: number, updateProductDto: UpdateProductDto): Promise<Product> {
        let product = await this.findOne(id);
        if (!product) {
            throw new NotFoundException('Product was not found');
        }
        product = Object.assign(product, updateProductDto);
        return this.productRepo.save(product);
    }

    async remove(id: number): Promise<Product> {
        const product = await this.findOne(id);
        if (!product) {
            throw new NotFoundException('Prodcut not found');
        }
        return this.productRepo.remove(product);
    }

    findProductByName(productName: string) {
        return this.productRepo
            .createQueryBuilder('product')
            .where('product.productName LIKE :name', { name: `%${productName}%` })
            .getMany();
    }

    findProductByCategory(category: string) {
        return this.productRepo.find({ where: { category: category } });
    }
}

