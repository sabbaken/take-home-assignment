import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CollectionDto } from '../common/collection.dto';
import { Role } from '../database/entities';
import { nextId } from '../database/next-id';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class RolesService {
  constructor(@InjectRepository(Role) private readonly roles: Repository<Role>) {}

  /** Alphabetical: this list is rendered straight into a filter dropdown. */
  async findAll(): Promise<CollectionDto<Role>> {
    const data = await this.roles.find({ order: { name: 'ASC' } });

    return { data, total: data.length };
  }

  async findOne(id: number): Promise<Role> {
    const role = await this.roles.findOneBy({ id });

    if (!role) {
      throw new NotFoundException(`Role ${id} not found`);
    }

    return role;
  }

  async create(dto: CreateRoleDto): Promise<Role> {
    const role = this.roles.create({ id: await nextId(this.roles), name: dto.name });

    // `insert`, not `save`: `save` on a row whose id already exists would
    // update it, and a `POST` must never overwrite somebody else's row.
    await this.roles.insert(role);

    return role;
  }

  async update(id: number, dto: UpdateRoleDto): Promise<Role> {
    const role = await this.findOne(id);

    // `undefined` on a PATCH means "leave the stored name alone".
    if (dto.name !== undefined) {
      role.name = dto.name;
    }

    return this.roles.save(role);
  }

  async remove(id: number): Promise<void> {
    // Look before deleting: `DELETE` on a row that was never there reports the
    // same nothing as a successful one, and that case owes the caller a 404.
    await this.findOne(id);

    await this.roles.delete(id);
  }
}
