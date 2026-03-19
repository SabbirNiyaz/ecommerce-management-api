import { IsString, IsNumber, IsNotEmpty, Min, IsOptional, IsIn } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateProductDto {

  @IsOptional()
  @IsString({ message: 'Category must be a string' })
  @IsNotEmpty({ message: 'Category cannot be empty' })
  category?: string;

  @IsOptional()
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name cannot be empty' })
  name?: string;

  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  @IsNotEmpty({ message: 'Description cannot be empty' })
  description?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Price must be a valid number' })
  @Min(1, { message: 'Price must be at least 1' })
  price?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Stock must be a valid number' })
  @Min(0, { message: 'Stock cannot be negative' })
  stock?: number;

  @IsOptional()
  @IsIn(['available', 'out_of_stock'], {
    message: 'Status must be either available or out_of_stock',
  })
  status?: string;

}