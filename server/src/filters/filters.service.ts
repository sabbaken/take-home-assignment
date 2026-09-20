import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Country, Department, Role } from '../database/entities';
import { FilterOptionsDto } from './dto/filter-options.dto';

@Injectable()
export class FiltersService {
  constructor(
    @InjectRepository(Country) private readonly countries: Repository<Country>,
    @InjectRepository(Department) private readonly departments: Repository<Department>,
    @InjectRepository(Role) private readonly roles: Repository<Role>,
  ) {}

  /** All three option lists in one response — one round trip instead of three. */
  async findAll(): Promise<FilterOptionsDto> {
    const order = { name: 'ASC' } as const;

    const [countries, departments, roles] = await Promise.all([
      this.countries.find({ order }),
      this.departments.find({ order }),
      this.roles.find({ order }),
    ]);

    return { countries, departments, roles };
  }
}
