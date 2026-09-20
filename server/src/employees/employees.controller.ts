import { Controller, Get, Query } from '@nestjs/common';
import { EmployeesResponseDto } from './dto/employee-row.dto';
import { FindEmployeesQueryDto } from './dto/find-employees-query.dto';
import { EmployeesService } from './employees.service';

@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Get()
  findAll(@Query() query: FindEmployeesQueryDto): Promise<EmployeesResponseDto> {
    return this.employeesService.findAll(query);
  }
}
