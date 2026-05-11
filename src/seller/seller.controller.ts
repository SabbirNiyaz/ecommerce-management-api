import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Patch, Query, UseInterceptors, Res, UseGuards, UploadedFiles, HttpException, HttpStatus, Req } from "@nestjs/common";
import { SellerService } from "./seller.service";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { UpdateStockDto } from "./dto/update-stock.dto";
import { FilesInterceptor } from "@nestjs/platform-express";
import { diskStorage, MulterError } from "multer";
import { join } from "path";
import { ProductEntity } from "./entities/product.entity";
import { JwtGuard } from "src/auth/jwt.guard";
import { existsSync } from "fs";
import express from "express";

@Controller('products')
export class SellerController {
    constructor(private readonly sellerService: SellerService) { }

    //---------------------------------- Product Get, Upload & Management ----------------------------------//
    //! Get all products
    // @Get()
    // async getAllProducts(): Promise<ProductEntity[]> {
    //     return this.sellerService.getAllProducts();
    // }

    //---------------------------------- Get Products with Pagination ----------------------------------//
    @Get()
    getAllProducts(
        @Query('page') page: string = '1',
        @Query('limit') limit: string = '16',
    ) {
        return this.sellerService.getAllProducts(Number(page), Number(limit))
    }

    //! Filter product
    @Get('/filter')
    async filterProduct(
        @Query('minPrice') minPrice?: number,
        @Query('status') qStatus?: string
    ): Promise<ProductEntity[]> {
        return this.sellerService.filterProduct(minPrice, qStatus);
    }

    //! Get products by id
    @Get('/:id')
    async getProductById(@Param('id', ParseIntPipe) id: number): Promise<ProductEntity> {
        return this.sellerService.getProductById(id);
    }

    //! Create product
    @Post()
    @UseGuards(JwtGuard)
    async createProduct(@Body() pDto: CreateProductDto, @Req() req: any): Promise<Partial<ProductEntity>> {
        // Check user role
        if (req.user.role !== 'seller') {
            throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
        }
        return this.sellerService.createProduct(pDto);
    }

    //! Update product
    @Put('/:id')
    @UseGuards(JwtGuard)
    async updateProduct(@Param('id', ParseIntPipe) id: number,
        @Body() pDto: UpdateProductDto, @Req() req: any): Promise<ProductEntity> {
        // Check user role
        if (req.user.role !== 'seller') {
            throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
        }
        return this.sellerService.updateProduct(id, pDto);
    }

    //! Update product stock and status
    @Patch('/:id')
    @UseGuards(JwtGuard)
    async updateProductStockAndStatus(@Param('id', ParseIntPipe) id: number,
        @Body() pDto: UpdateStockDto, @Req() req: any): Promise<ProductEntity> {
        // Check user role
        if (req.user.role !== 'seller') {
            throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
        }
        return this.sellerService.updateProductStockAndStatus(id, pDto);
    }

    //! Delete product
    @Delete('/:id')
    @UseGuards(JwtGuard)
    async deleteProduct(@Param('id', ParseIntPipe) id: number, @Req() req: any): Promise<string> {
        // Check user role
        if (req.user.role !== 'seller') {
            throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
        }
        return this.sellerService.deleteProduct(id);
    }

    //---------------------------------- Image Get, Upload & Management ----------------------------------//
    //! Get image by filename
    @Get('images/:filename')
    getProductImage(
        @Param('filename') filename: string,
        @Res() res: express.Response,
    ) {
        const filePath = join(process.cwd(), 'src', 'uploads', 'products', filename);
        if (!existsSync(filePath)) {
            return res.status(404).json({
                success: false,
                message: 'Image not found'
            });
        }
        return res.sendFile(filePath);
    }

    //! Upload multiple images for a product
    @Post('/:productId/images')
    @UseGuards(JwtGuard)
    @UseInterceptors(
        FilesInterceptor('images', 10, {
            fileFilter: (req, file, cb) => {
                if (file.originalname.match(/^.*\.(jpg|jpeg|png|webp)$/i)) {
                    cb(null, true);
                } else {
                    cb(
                        new MulterError('LIMIT_UNEXPECTED_FILE', 'Only JPG, PNG, WEBP allowed'),
                        false,
                    );
                }
            },
            limits: { fileSize: 5 * 1024 * 1024 }, // 5MB per image
            storage: diskStorage({
                destination: join(process.cwd(), 'src', 'uploads', 'products'),
                filename: (req, file, cb) => {
                    cb(null, `${Date.now()}-${file.originalname}`);
                },
            }),
        }),
    )
    uploadProductImages(
        @Param('productId', ParseIntPipe) productId: number,
        @UploadedFiles() files: Express.Multer.File[],
        @Req() req: any
    ) {
        // Check user role
        if (req.user.role !== 'seller') {
            throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
        }
        return this.sellerService.saveProductImages(productId, files);
    }

    //! Delete a single image by image ID
    @Delete('image/:imageId')
    @UseGuards(JwtGuard)
    deleteProductImage(@Param('imageId', ParseIntPipe) imageId: number, @Req() req: any) {
        // Check user role
        if (req.user.role !== 'seller') {
            throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
        }
        return this.sellerService.deleteProductImage(imageId)
    }

    //! Delete All images of product
    @Delete(':productId/images')
    @UseGuards(JwtGuard)
    deleteAllProductImages(@Param('productId', ParseIntPipe) productId: number, @Req() req: any) {
        // Check user role
        if (req.user.role !== 'seller') {
            throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
        }
        return this.sellerService.deleteAllProductImages(productId);
    }
}

