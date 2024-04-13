import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductNameSearchDTO } from './dto/product-name-search.dto';
import { AuthGuard } from 'src/guards/auth/auth.guard';
import { IscustomerInterceptor } from './interceptor/iscustomer/iscustomer.interceptor';
import { ProductCategorySearchDTO } from './dto/product-category-search.dto';
import { IsstaffGuard } from 'src/guards/isstaff/isstaff.guard';
import { Logger } from '@nestjs/common';
import { ReturningStatementNotSupportedError } from 'typeorm';

@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService, private readonly logger: Logger) {}

    @Post()
    @UseGuards(IsstaffGuard)
    create(@Body() createProductDto: CreateProductDto) {
        return this.productsService.create(createProductDto);
    }

    @Get()
    @UseGuards(AuthGuard)
    @UseInterceptors(IscustomerInterceptor)
    findAll() {
        return this.productsService.findAll();
    }

    @Get(':id')
    @UseGuards(AuthGuard)
    @UseInterceptors(IscustomerInterceptor)
    findOne(@Param('id') id: string) {
        return this.productsService.findOne(+id);
    }

    @Patch(':id')
    @UseGuards(IsstaffGuard)
    update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
        return this.productsService.update(+id, updateProductDto);
    }

    @Delete(':id')
    @UseGuards(IsstaffGuard)
    remove(@Param('id') id: string) {
        return this.productsService.remove(+id);
    }

    @Post('search-product-name')
    @UseGuards(AuthGuard)
    searchProductsByName(@Body() productNameSearchDTO: ProductNameSearchDTO) {
        return this.productsService.findProductByName(productNameSearchDTO.productName);
    }

    @Post('search-product-category')
    @UseGuards(AuthGuard)
    searchProductsByCategory(@Body() productCategorySearchDTO: ProductCategorySearchDTO) {
        return this.productsService.findProductByCategory(productCategorySearchDTO.category);
    }
}
