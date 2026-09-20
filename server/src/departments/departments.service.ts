import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CollectionDto } from '../common/collection.dto';
import { Department } from '../database/entities';
import { nextId } from '../database/next-id';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';

@Injectable()
export class DepartmentsService {
  constructor(@InjectRepository(Department) private readonly departments: Repository<Department>) {}

  /** Alphabetical: this list is rendered straight into a filter dropdown. */
  async findAll(): Promise<CollectionDto<Department>> {
    const data = await this.departments.find({ order: { name: 'ASC' } });

    return { data, total: data.length };
  }

  async findOne(id: number): Promise<Department> {
    const department = await this.departments.findOneBy({ id });

    if (!department) {
      throw new NotFoundException(`Department ${id} not found`);
    }

    return department;
  }

  async create(dto: CreateDepartmentDto): Promise<Department> {
    const department = this.departments.create({
      id: await nextId(this.departments),
      name: dto.name,
    });

    // `insert`, not `save`: `save` on a row whose id already exists would
    // update it, and a `POST` must never overwrite somebody else's row.
    await this.departments.insert(department);

    return department;
  }

  async update(id: number, dto: UpdateDepartmentDto): Promise<Department> {
    const department = await this.findOne(id);

    // `undefined` on a PATCH means "leave the stored name alone".
    if (dto.name !== undefined) {
      department.name = dto.name;
    }

    return this.departments.save(department);
  }

  async remove(id: number): Promise<void> {
    // Look before deleting: `DELETE` on a row that was never there reports the
    // same nothing as a successful one, and that case owes the caller a 404.
    await this.findOne(id);

    await this.departments.delete(id);
  }
}
