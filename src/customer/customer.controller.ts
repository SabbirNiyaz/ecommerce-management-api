import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CustomerDTO } from './customer.dto';
@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Get('allProducts') getAll(): object {
    return this.customerService.getAllProducts();
  }

  @Get('user/:id') getCustomerById(
    @Param('id', ParseIntPipe) id: number,
  ): object {
    return this.customerService.getById(id);
  }

  @Get('search') searchCustomer(
    @Query('name') name: string,
    @Query('age', ParseIntPipe) age: number,
  ): object {
    return this.customerService.searchCustomer(name, age);
  }

  @Post('create') createCustomer(@Body() data: CustomerDTO): object {
    return this.customerService.createCustomer(data);
  }

  @Put(':id') updateCustomer(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: CustomerDTO,
  ): object {
    return this.customerService.update(id, data);
  }

  @Patch(':id') partialUpdate(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: CustomerDTO,
  ): object {
    return this.customerService.partialUpdate(id, data);
  }

  @Delete(':id') deleteCustomer(@Param('id', ParseIntPipe) id: number): object {
    return this.customerService.delete(id);
  }

  @Get('by-email') getByEmail(@Query('email') email: string): object {
    return this.customerService.getByEmail(email);
  }
}
