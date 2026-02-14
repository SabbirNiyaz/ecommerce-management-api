import { Injectable } from "@nestjs/common"
import { demoProducts } from "./db/productDb"
import { CreateProductDto } from "./dto/create-product.dto"
import { UpdateProductDto } from "./dto/update-product.dto"
import { UpdateStockDto } from "./dto/update-stock.dto"
import { oderDemo } from "./db/oderDb"
@Injectable()
export class SellerService {
    //Get all products
    getAllProducts(): object {
        return {
            success: true,
            products: demoProducts
        }
    }
    // Get products by id
    getProductById(id: number): object {
        return {
            success: true,
            product: demoProducts[`${id - 1}`] ? demoProducts[`${id - 1}`] :
                'No Product Found'
        }
    }
    // Create product
    createProduct(pObj: CreateProductDto): object {
        return {
            success: true,
            data: pObj
        }
    }
    // Update product
    updateProduct(id: number, pObj: UpdateProductDto): object {
        if (demoProducts[`${id - 1}`]) {
            return {
                success: true,
                id: id,
                data: pObj
            }
        }
        return {
            success: false,
            message: "Id is not exits"
        }
    }
    // Update product stock
    updateProductStock(id: number, pObj: UpdateStockDto): object {
        if (demoProducts[`${id - 1}`]) {
            return {
                success: true,
                id: id,
                name: demoProducts[`${id - 1}`].name,
                category: demoProducts[`${id - 1}`].category,
                Updated: pObj
            }
        }
        return {
            success: false,
            message: "Id is not exits"
        }
    }
    // Delete product
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
    // Search oder
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
}
