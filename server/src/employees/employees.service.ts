import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Employee } from '../database/entities';
import { EmployeeRowDto, EmployeesResponseDto } from './dto/employee-row.dto';
import { FindEmployeesQueryDto } from './dto/find-employees-query.dto';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employee)
    private readonly employees: Repository<Employee>,
  ) {}

  async findAll(query: FindEmployeesQueryDto): Promise<EmployeesResponseDto> {
    const qb = this.employees
      .createQueryBuilder('employee')
      // Left joins: the FK columns are nullable in the given schema, so an
      // employee without a role must still show up in the unfiltered table.
      .leftJoinAndSelect('employee.role', 'role')
      .leftJoinAndSelect('employee.country', 'country')
      .leftJoinAndSelect('employee.department', 'department')
      .orderBy('employee.id', 'ASC');

    // OR inside a group (IN), AND between groups (separate andWhere calls).
    this.applyIdFilter(qb, 'role.id', 'roleIds', query.roleIds);
    this.applyIdFilter(qb, 'country.id', 'countryIds', query.countryIds);
    this.applyIdFilter(qb, 'department.id', 'departmentIds', query.departmentIds);

    const rows = await qb.getMany();

    return { data: rows.map(toEmployeeRow), total: rows.length };
  }

  private applyIdFilter(
    qb: SelectQueryBuilder<Employee>,
    column: string,
    paramName: string,
    ids: number[] | undefined,
  ): void {
    if (!ids?.length) {
      return;
    }

    qb.andWhere(`${column} IN (:...${paramName})`, { [paramName]: ids });
  }
}

const toEmployeeRow = (employee: Employee): EmployeeRowDto => ({
  id: employee.id,
  firstName: employee.firstName,
  lastName: employee.lastName,
  role: employee.role?.name ?? null,
  country: employee.country?.name ?? null,
  department: employee.department?.name ?? null,
});
