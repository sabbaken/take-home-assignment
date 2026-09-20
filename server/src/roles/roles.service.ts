import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './entities/role.entity';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class RolesService {
  constructor(@InjectRepository(Role) private readonly roles: Repository<Role>) {}

  /** Alphabetical: this list is rendered straight into a filter dropdown. */
  findAll(): Promise<Role[]> {
    return this.roles.find({ order: { name: 'ASC' } });
  }

  async findOne(id: number): Promise<Role> {
    const role = await this.roles.findOneBy({ id });

    if (!role) {
      throw new NotFoundException(`Role ${id} not found`);
    }

    return role;
  }

  create(dto: CreateRoleDto): Promise<Role> {
    return this.roles.save(this.roles.create(dto));
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
