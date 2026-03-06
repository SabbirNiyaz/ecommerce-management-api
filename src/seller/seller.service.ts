import { HttpException, HttpStatus, Injectable } from "@nestjs/common"
import { demoProducts } from "./db/productDb"
import { CreateProductDto } from "./dto/create-product.dto"
import { UpdateProductDto } from "./dto/update-product.dto"
import { UpdateStockDto } from "./dto/update-stock.dto"
import { oderDemo } from "./db/oderDb"
import { VerifySellerDto } from "./dto/verify-seller.dto"
import { ProductEntity } from "./entities/product.entity"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"

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
            }
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
            }
        })
        if (singleProduct === null) {
            throw new HttpException('No product found', HttpStatus.NOT_FOUND);
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
    updateProduct(id: number, pDto: UpdateProductDto): object {
        if (demoProducts[`${id - 1}`]) {
            return {
                success: true,
                id: id,
                data: pDto
            }
        }
        return {
            success: false,
            message: "Id is not exits"
        }
    }

    //! Update product stock
    updateProductStock(id: number, pDto: UpdateStockDto): object {
        if (demoProducts[`${id - 1}`]) {
            return {
                success: true,
                id: id,
                name: demoProducts[`${id - 1}`].name,
                category: demoProducts[`${id - 1}`].category,
                Updated: pDto
            }
        }
        return {
            success: false,
            message: "Id is not exits"
        }
    }

    //! Delete product
    deleteProduct(id: number) {
        if (demoProducts[`${id - 1}`]) {
            return {
                success: true,
                message: "Deleted"
            }
        }
        return {
            success: false,
            message: "Id is not exits"
        }
    }
    viewOder(): object {
        return {
            success: true,
            data: oderDemo
        }
    }

    //! Search oder
    searchOder(oderId?: number, status?: string) {
        if (status) {
            const result = oderDemo.filter(order => order.status.toLowerCase() === status.toLowerCase());
            if (result.length > 0) {
                return { success: true, orders: result };
            }
        }

        // filter by orderId 
        if (oderDemo[oderId! - 1]) {
            return {
                success: true,
                data: oderDemo[oderId! - 1]
            };
        }
        return {
            success: false,
            message: "Query is not exits"
        }
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
