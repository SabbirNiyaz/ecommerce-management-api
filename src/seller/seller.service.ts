import { HttpException, HttpStatus, Injectable } from "@nestjs/common"
import { demoProducts } from "./db/productDb"
import { CreateProductDto } from "./dto/create-product.dto"
import { UpdateProductDto } from "./dto/update-product.dto"
import { UpdateStockDto } from "./dto/update-stock.dto"
import { oderDemo } from "./db/oderDb"
import { VerifySellerDto } from "./dto/verify-seller.dto"
import { ProductEntity } from "./entities/product.entity"
import { InjectRepository } from "@nestjs/typeorm"
import { MoreThan, Repository } from "typeorm"

@Injectable()
export class SellerService {
    constructor(
        @InjectRepository(ProductEntity) private productRepo: Repository<ProductEntity>,
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
            if (newProduct.stock < 1) {
                newProduct.status = "out_of_stock";
            } else {
                newProduct.status = "available";
            }

            // Save to database
            return await this.productRepo.save(newProduct);

        } catch (error) {
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
            if (findProduct.stock < 1) {
                findProduct.status = "out_of_stock";
            } else {
                findProduct.status = "available";
            }
            // Merge DTO into found product
            Object.assign(findProduct, pDto);

            // Save the updated entity
            const updateProduct = await this.productRepo.save(findProduct);
            return updateProduct;

        } catch (error) {
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

        } catch (error) {
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

        } catch (error) {
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
                price: 'ASC',
            },
        });

        if (!filterProduct || filterProduct.length === 0) {
            throw new HttpException('No product found', HttpStatus.NOT_FOUND);
        }
        return filterProduct;
    }

    //! Sellers Info verification
    sellerInfoVerify(dto: VerifySellerDto, file: Express.Multer.File) {
        const seller = {
            id: Date.now().toString(),
            ...dto,
            document: file.filename,
        };
        return {
            message: 'Seller verified successfully',
            seller,
        };
    }
}
