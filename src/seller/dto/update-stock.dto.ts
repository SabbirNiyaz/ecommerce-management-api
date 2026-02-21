import { Type } from 'class-transformer';
import { IsNumber, IsNotEmpty, Min } from 'class-validator';

export class UpdateStockDto {
  @Type(() => Number)
  @IsNumber({}, { message: 'Stock must be a valid number' })
  @IsNotEmpty({ message: 'Stock is required' })
  @Min(0, { message: 'Stock cannot be negative' })
  stock: number;
}