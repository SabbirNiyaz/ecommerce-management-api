import { Injectable } from '@nestjs/common';
import { CustomerDTO } from './customer.dto';
@Injectable()
export class CustomerService {
  getAllProducts(): object {
    return { message: 'all products' };
  }

  searchCustomer(name: string, age: number): object {
    return { name: name, age: age, result: 'search active' };
  }

  getById(id: number): object {
    return { id: id, status: 'found' };
  }

  createCustomer(data: CustomerDTO): object {
    return { data, message: 'customer created' };
  }

  update(id: number, data: CustomerDTO): object {
    return { id: id, updatedData: data, message: 'customer fully updated' };
  }

  partialUpdate(id: number, data: CustomerDTO): object {
    return { id: id, partialData: data, message: 'customer patched' };
  }

  delete(id: number): object {
    return { id: id, message: 'customer deleted' };
  }

  getByEmail(email: string): object {
    return { email: email, message: 'customer found by email' };
  }
}
