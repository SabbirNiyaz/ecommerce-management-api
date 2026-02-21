import { Injectable } from "@nestjs/common"
import { demoProducts } from "./db/productDb"
import { CreateProductDto } from "./dto/create-product.dto"
import { UpdateProductDto } from "./dto/update-product.dto"
import { UpdateStockDto } from "./dto/update-stock.dto"
import { oderDemo } from "./db/oderDb"
import { VerifySellerDto } from "./dto/verify-seller.dto"

@Injectable()
export class SellerService {
    //! Get all products
    getAllProducts(): object {
        return {
            success: true,
            products: demoProducts
        }
    }

    //! Get products by id
    getProductById(id: number): object {
        return {
            success: true,
            product: demoProducts[`${id - 1}`] ? demoProducts[`${id - 1}`] :
                'No Product Found'
        }
    }

    //! Create product
    createProduct(pDto: CreateProductDto): object {
        return {
            success: true,
            data: pDto
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
