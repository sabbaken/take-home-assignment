import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  FindOptionsRelations,
  QueryDeepPartialEntity,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import { Employee } from '../database/entities';
import { nextId } from '../database/next-id';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { EmployeeRowDto, EmployeesResponseDto } from './dto/employee-row.dto';
import { FindEmployeesQueryDto } from './dto/find-employees-query.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';

/** The three names on every row come from the relations, so reads always join them. */
const RELATIONS: FindOptionsRelations<Employee> = { role: true, country: true, department: true };

@Injectable()
export class EmployeesService {
  constructor(@InjectRepository(Employee) private readonly employees: Repository<Employee>) {}

  /**
   * The assignment's table query: OR inside a group (one `IN`), AND between
   * groups (one `andWhere` each).
   */
  async findAll(query: FindEmployeesQueryDto = {}): Promise<EmployeesResponseDto> {
    const qb = this.employees
      .createQueryBuilder('employee')
      // Left joins: the FK columns are nullable in the given schema, so an
      // employee without a role must still show up in the unfiltered table.
      .leftJoinAndSelect('employee.role', 'role')
      .leftJoinAndSelect('employee.country', 'country')
      .leftJoinAndSelect('employee.department', 'department')
      .orderBy('employee.id', 'ASC');

    applyIdFilter(qb, 'role.id', 'roleIds', query.roleIds);
    applyIdFilter(qb, 'country.id', 'countryIds', query.countryIds);
    applyIdFilter(qb, 'department.id', 'departmentIds', query.departmentIds);

    const rows = await qb.getMany();

    return { data: rows.map(toRow), total: rows.length };
  }

  async findOne(id: number): Promise<EmployeeRowDto> {
    const employee = await this.employees.findOne({ where: { id }, relations: RELATIONS });

    if (!employee) {
      throw new NotFoundException(`Employee ${id} not found`);
    }

    return toRow(employee);
  }

  async create(dto: CreateEmployeeDto): Promise<EmployeeRowDto> {
    const id = await nextId(this.employees);

    // `insert`, not `save`: `save` on a row whose id already exists would
    // update it, and a `POST` must never overwrite somebody else's row. An id
    // the caller left out is a null column — all three FKs are nullable.
    await this.employees.insert({
      id,
      firstName: dto.firstName,
      lastName: dto.lastName,
      role: toReference(dto.roleId),
      country: toReference(dto.countryId),
      department: toReference(dto.departmentId),
    });

    // Re-read rather than echo the body back: the relations went in as ids and
    // the response owes the client their names.
    return this.findOne(id);
  }

  async update(id: number, dto: UpdateEmployeeDto): Promise<EmployeeRowDto> {
    await this.findOne(id);

    // Key by key, because an absent key and an explicit `null` mean different
    // things on PATCH: "leave it" versus "clear it".
    const changes: QueryDeepPartialEntity<Employee> = {};

    if (dto.firstName !== undefined) {
      changes.firstName = dto.firstName;
    }

    if (dto.lastName !== undefined) {
      changes.lastName = dto.lastName;
    }

    if (dto.roleId !== undefined) {
      changes.role = toReference(dto.roleId);
    }

    if (dto.countryId !== undefined) {
      changes.country = toReference(dto.countryId);
    }

    if (dto.departmentId !== undefined) {
      changes.department = toReference(dto.departmentId);
    }

    if (Object.keys(changes).length > 0) {
      await this.employees.update(id, changes);
    }

    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    // Look before deleting: `DELETE` on a row that was never there reports the
    // same nothing as a successful one, and that case owes the caller a 404.
    await this.findOne(id);

    await this.employees.delete(id);
  }
}

/** Entity row -> the flat JSON the table renders: names, not nested objects. */
const toRow = (employee: Employee): EmployeeRowDto => ({
  id: employee.id,
  firstName: employee.firstName,
  lastName: employee.lastName,
  role: employee.role?.name ?? null,
  country: employee.country?.name ?? null,
  department: employee.department?.name ?? null,
});

/** A foreign key on the way in: the id alone is enough to write the column. */
const toReference = (id: number | null | undefined): { id: number } | null =>
  id === undefined || id === null ? null : { id };

const applyIdFilter = (
  qb: SelectQueryBuilder<Employee>,
  column: string,
  paramName: string,
  ids: number[] | undefined,
): void => {
  if (!ids?.length) {
    return;
  }

  qb.andWhere(`${column} IN (:...${paramName})`, { [paramName]: ids });
};
