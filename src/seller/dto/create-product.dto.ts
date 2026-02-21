import { Type } from 'class-transformer';
import { IsString, IsNumber, IsNotEmpty, Min } from 'class-validator';

export class CreateProductDto {

    @IsString({ message: 'Product name must be a string' })
    @IsNotEmpty({ message: 'Product name is required' })
    name: string;

    @IsString({ message: 'Category must be a string' })
    @IsNotEmpty({ message: 'Category is required' })
    category: string;

    @Type(() => Number)
    @IsNumber({}, { message: 'Price must be a number' })
    @IsNotEmpty({ message: 'Price is required' })
    @Min(1, { message: 'Price must be at least 1' })
    price: number;

    @Type(() => Number)
    @IsNumber({}, { message: 'Stock must be a number' })
    @IsNotEmpty({ message: 'Stock is required' })
    @Min(0, { message: 'Stock cannot be negative' })
    stock: number;

    @IsString({ message: 'Description must be a string' })
    @IsNotEmpty({ message: 'Description is required' })
    description: string;
}