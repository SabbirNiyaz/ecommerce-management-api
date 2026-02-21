import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Patch, Query, UsePipes, ValidationPipe } from "@nestjs/common";
import { SellerService } from "./seller.service";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { UpdateStockDto } from "./dto/update-stock.dto";

@Controller('seller')
export class SellerController {
    constructor(private readonly sellerService: SellerService) { }

    // Get all products
    @Get('products')
    getAllProducts(): object {
        return this.sellerService.getAllProducts();
    }
    // Get products by id
    @Get('products/:id')
    getProductById(@Param('id', ParseIntPipe) id: number): object {
        return this.sellerService.getProductById(id);
    }
    // Create product
    @Post('products')
    // @UsePipes(new ValidationPipe()) // Apply the validation
    createProduct(@Body() pObj: CreateProductDto) {
        return this.sellerService.createProduct(pObj);
    }
    // Update product
    @Put('products/:id')
    updateProduct(@Param('id', ParseIntPipe) id: number, @Body() pObj: UpdateProductDto) {
        return this.sellerService.updateProduct(id, pObj);
    }
    // Update product stock
    @Patch('products/:id')
    updateProductStock(@Param('id', ParseIntPipe) id: number, @Body() pObj: UpdateStockDto) {
        return this.sellerService.updateProductStock(id, pObj);
    }
    // Delete product
    @Delete('products/:id')
    deleteProduct(@Param('id', ParseIntPipe) id: number) {
        return this.sellerService.deleteProduct(id);
    }
    // Get all oder
    @Get('oder')
    viewOder(): object {
        return this.sellerService.viewOder();
    }
    // Search oder
    @Get('oder/search')
    searchOder(@Query('order_id', ParseIntPipe) oderId: number,
        @Query('status') status: string
    ): object {
        return this.sellerService.searchOder(oderId, status);
    }
}
