import { HttpException, HttpStatus, Injectable, NotFoundException } from "@nestjs/common"
import { CreateProductDto } from "./dto/create-product.dto"
import { UpdateProductDto } from "./dto/update-product.dto"
import { UpdateStockDto } from "./dto/update-stock.dto"
import { ProductEntity } from "./entities/product.entity"
import { InjectRepository } from "@nestjs/typeorm"
import { MoreThan, Repository } from "typeorm"
import { ProductImageEntity } from "./entities/product-image.entity"
import { join } from "path"
import { existsSync, unlinkSync } from "fs"

@Injectable()
export class SellerService {
    constructor(
        @InjectRepository(ProductEntity)
        private productRepo: Repository<ProductEntity>,

        @InjectRepository(ProductImageEntity)
        private productImageRepo: Repository<ProductImageEntity>,
    ) { }
    //! Get all products 
    async getAllProducts(): Promise<ProductEntity[]> {
        const allProduct = await this.productRepo.find({
            select: {
                id: true,
                name: true,
                description: true,
                price: true,
                stock: true,
                status: true,
            },
            order: {
                id: 'ASC'
            },
            relations: ['images'],
        })
        if (allProduct.length === 0) {
            throw new HttpException('No product found', HttpStatus.NOT_FOUND);
        }
        return allProduct;
    }

    //! Get products by id
    async getProductById(id: number): Promise<ProductEntity> {
        const singleProduct = await this.productRepo.findOne({
            where: { id },
            select: {
                id: true,
                name: true,
                description: true,
                price: true,
                stock: true,
                status: true,
            },
            relations: ['images']
        })
        if (singleProduct === null) {
            throw new HttpException(`Product id:${id} is not found`, HttpStatus.NOT_FOUND);
        }
        return singleProduct;
    }

    //! Create product
    async createProduct(pDto: CreateProductDto): Promise<ProductEntity> {
        try {
            // Create entity instance
            const newProduct = await this.productRepo.create(pDto);

            // Automatically set status based on stock 
            const stock = newProduct.stock ?? 0;
            if (stock < 1) {
                newProduct.status = "out_of_stock";
            } else {
                newProduct.status = "available";
            }

            // Save to database
            return await this.productRepo.save(newProduct);

        } catch (error: any | string) {
            console.error('Error creating product:', error.message);
            throw new HttpException(`Error: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    //! Update product
    async updateProduct(id: number, pDto: UpdateProductDto): Promise<ProductEntity> {
        const findProduct = await this.productRepo.findOneBy({ id })
        if (findProduct === null) {
            throw new HttpException(`Product id:${id} is not found`, HttpStatus.NOT_FOUND);
        }
        try {
            // Automatically set status based on stock 
            const currentStock = findProduct.stock ?? 0;
            if (currentStock < 1) {
                findProduct.status = "out_of_stock";
            } else {
                findProduct.status = "available";
            }
            // Merge DTO into found product
            Object.assign(findProduct, pDto);

            // Save the updated entity
            const updateProduct = await this.productRepo.save(findProduct);
            return updateProduct;

        } catch (error: any | string) {
            console.error('Error updating product:', error.message);
            throw new HttpException(`Error: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    //! Update product stock and status
    async updateProductStockAndStatus(id: number, pDto: UpdateStockDto): Promise<ProductEntity> {
        const findProduct = await this.productRepo.findOneBy({ id })
        if (findProduct === null) {
            throw new HttpException(`Product id:${id} is not found`, HttpStatus.NOT_FOUND);
        }
        try {
            // Automatically set stock based on status 
            if (pDto.status === "out_of_stock") {
                pDto.stock = 0;
            }
            if (pDto.stock === 0) {
                pDto.status = "out_of_stock"
            }
            // Merge DTO into found product
            Object.assign(findProduct, pDto);

            // Save the updated entity
            const updateProduct = await this.productRepo.save(findProduct);
            return updateProduct;

        } catch (error: any | string) {
            console.error('Error updating product:', error.message);
            throw new HttpException(`Error: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    //! Delete product
    async deleteProduct(id: number): Promise<any> {
        const findProduct = await this.productRepo.findOneBy({ id })
        if (findProduct === null) {
            throw new HttpException(`Product id:${id} is not found`, HttpStatus.NOT_FOUND);
        }
        try {
            await this.productRepo.delete({ id })
            return {
                success: true,
                message: `User with ID ${id} has been deleted`,
            };

        } catch (error: any | string) {
            console.error('Error deleting product:', error.message);
            throw new HttpException(`Error: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);

        }
    }

    //! Filter product
    async filterProduct(minPrice?: number, qStatus?: string): Promise<ProductEntity[]> {
        // Build where conditions dynamically
        const where: any[] = [];

        if (qStatus) {
            where.push({ status: qStatus });
        }
        if (minPrice !== undefined) {
            where.push({ price: MoreThan(minPrice) });
        }

        // If no filters, just get all
        const filterProduct = await this.productRepo.find({
            where: where.length > 0 ? where : undefined,
            select: {
                id: true,
                name: true,
                description: true,
                price: true,
                stock: true,
                status: true,
            },
            order: {
                id: 'ASC',
            },
        });

        if (!filterProduct || filterProduct.length === 0) {
            throw new HttpException('No product found', HttpStatus.NOT_FOUND);
        }
        return filterProduct;
    }

    //! Save uploaded images linked to a product
    async saveProductImages(productId: number, files: Express.Multer.File[]) {
        // Check product exists
        const product = await this.productRepo.findOne({
            where: { id: productId },
            relations: ['images'],
        });
        if (!product) {
            // Cleanup uploaded files if product not found
            files.forEach((file) => {
                if (file.filename) {
                    const filePath = join(process.cwd(), 'src', 'uploads', 'products', file.filename);
                    if (existsSync(filePath)) unlinkSync(filePath);
                }
            });
            throw new NotFoundException(`Product #${productId} not found`);
        }

        // Check if product already has a primary image
        const hasPrimary = product.images?.some((img) => img.isPrimary);

        // Build image entities
        const images = files.map((file, index) =>
            this.productImageRepo.create({
                filename: file.filename,
                originalName: file.originalname,
                url: `/products/images/${file.filename}`,
                isPrimary: !hasPrimary && index === 0, // only first if no primary exists
                productId: Number(productId),
                product,
            }),
        );

        const saved = await this.productImageRepo.save(images);

        return {
            success: true,
            uploaded: saved.length,
            images: saved,
        };
    }

    //! Delete a single image by image ID
    async deleteProductImage(imageId: number) {
        const image = await this.productImageRepo.findOne({
            where: { id: imageId },
        });

        if (!image) {
            throw new NotFoundException(`Image #${imageId} not found`);
        }
        // Remove file from disk
        if (image.filename) {
            const filePath = join(process.cwd(), 'src', 'uploads', 'products', image.filename);
            if (existsSync(filePath)) unlinkSync(filePath);
        }

        await this.productImageRepo.remove(image);

        return {
            success: true,
            message: `Image #${imageId} deleted successfully`,
        };
    }

    //! Delete All images of product
    async deleteAllProductImages(productId: number) {
        const product = await this.productRepo.findOne({
            where: { id: productId },
            relations: ['images']
        });

        if (!product) {
            throw new NotFoundException(`Product #${productId} not found`);
        }
        if (!product.images?.length) {
            return {
                success: false,
                message: 'No images found for this product',
                deleted: 0
            };
        }
        // Remove each file from disk
        product.images.forEach((image) => {
            if (image.filename) {
                const filePath = join(process.cwd(), 'src', 'uploads', 'products', image.filename);
                if (existsSync(filePath)) unlinkSync(filePath);
            }
        });

        await this.productImageRepo.remove(product.images);

        return {
            success: true,
            message: `All images of product #${productId} deleted successfully`,
            deleted: product.images.length,
        };
    }
}
