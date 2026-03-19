import { Type } from 'class-transformer';
import { IsNumber, IsNotEmpty, Min, IsIn, IsOptional } from 'class-validator';

export class UpdateStockDto {
  @Type(() => Number)
  @IsNumber({}, { message: 'Stock must be a valid number' })
  @IsOptional()
  @Min(0, { message: 'Stock cannot be negative' })
  stock: number;

  @IsNotEmpty({ message: 'Status is required' })
  @IsIn(['available', 'out_of_stock'], {
    message: 'Status must be either available or out_of_stock',
  })
  status?: string;
}