import { IsString, IsNumber, IsNotEmpty, Min } from 'class-validator';

export class UpdateProductDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    category: string;

    @IsNumber()
    @IsNotEmpty()
    @Min(1)
    price: number;

    @IsNumber()
    @IsNotEmpty()
    @Min(0)
    stock: number;

    @IsString()
    @IsNotEmpty()
    description: string;
}
