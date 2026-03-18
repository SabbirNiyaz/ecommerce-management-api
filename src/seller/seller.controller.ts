import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Patch, Query, UseInterceptors, UploadedFile, Res, UseGuards } from "@nestjs/common";
import type { Response } from "express";
import { SellerService } from "./seller.service";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { UpdateStockDto } from "./dto/update-stock.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { VerifySellerDto } from "./dto/verify-seller.dto";
import { diskStorage, MulterError } from "multer";
import { join } from "path/win32";
import { existsSync } from "fs";
import { ProductEntity } from "./entities/product.entity";
import { JwtGuard } from "src/auth/jwt.guard";

@Controller('seller')
export class SellerController {
    constructor(private readonly sellerService: SellerService) { }

    //! Get all products
    @Get('products')
    async getAllProducts(): Promise<ProductEntity[]> {
        return this.sellerService.getAllProducts();
    }

    //! Get products by id
    @Get('products/:id')
    async getProductById(@Param('id', ParseIntPipe) id: number): Promise<ProductEntity> {
        return this.sellerService.getProductById(id);
    }

    //! Create product
    @Post('products')
    @UseGuards(JwtGuard)
    async createProduct(@Body() pDto: CreateProductDto): Promise<ProductEntity> {
        return this.sellerService.createProduct(pDto);
    }

    //! Update product
    @Put('products/:id')
    @UseGuards(JwtGuard)
    async updateProduct(@Param('id', ParseIntPipe) id: number,
        @Body() pDto: UpdateProductDto): Promise<ProductEntity> {
        return this.sellerService.updateProduct(id, pDto);
    }

    //! Update product stock and status
    @Patch('products/:id')
    @UseGuards(JwtGuard)
    async updateProductStockAndStatus(@Param('id', ParseIntPipe) id: number,
        @Body() pDto: UpdateStockDto): Promise<ProductEntity> {
        return this.sellerService.updateProductStockAndStatus(id, pDto);
    }

    //! Delete product
    @Delete('products/:id')
    @UseGuards(JwtGuard)
    async deleteProduct(@Param('id', ParseIntPipe) id: number): Promise<string> {
        return this.sellerService.deleteProduct(id);
    }

    //! Filter product
    @Get('product')
    async filterProduct(
        @Query('minPrice') minPrice?: number,
        @Query('status') qStatus?: string
    ): Promise<ProductEntity[]> {
        return this.sellerService.filterProduct(minPrice, qStatus);
    }

    //! Sellers Info verification
    @Post('verifyInfo')
    @UseInterceptors(
        FileInterceptor('file', {
            fileFilter: (req, file, cb) => {
                // Allow only PDF
                if (file.originalname.match(/^.*\.(pdf)$/)) {
                    cb(null, true);
                } else {
                    cb(
                        new MulterError('LIMIT_UNEXPECTED_FILE', 'Only PDF allowed'),
                        false,
                    );
                }
            },
            limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
            storage: diskStorage({
                destination: join(process.cwd(), 'src', 'uploads'),
                filename: function (req, file, cb) {
                    cb(null, Date.now() + '-' + file.originalname);
                },
            }),
        }),
    )
    sellerInfoVerify(
        @Body() sDto: VerifySellerDto,
        @UploadedFile() file: Express.Multer.File,
    ) {
        return this.sellerService.sellerInfoVerify(sDto, file);
    }

    //! Get sellers file info
    @Get('/getFile/:name')
    getFile(@Param('name') name: string, @Res() res: Response) {
        // Build the absolute path
        const filePath = join(process.cwd(), 'src', 'uploads', name);
        // Check if file exists
        if (!existsSync(filePath)) {
            return res.status(404).json({
                success: false,
                message: 'File not found'
            });
        }
        // Send the file
        return res.sendFile(filePath);
    }
}

