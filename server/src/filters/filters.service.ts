import { Injectable } from '@nestjs/common';
import { CountriesService } from '../countries/countries.service';
import { DepartmentsService } from '../departments/departments.service';
import { RolesService } from '../roles/roles.service';
import { FilterOptionsDto } from './dto/filter-options.dto';

@Injectable()
export class FiltersService {
  constructor(
    private readonly countries: CountriesService,
    private readonly departments: DepartmentsService,
    private readonly roles: RolesService,
  ) {}

  /**
   * A view over the three lookup resources rather than a resource of its own:
   * the filter bar needs all three lists at once and should not pay for three
   * round trips to assemble one row of dropdowns.
   */
  async findAll(): Promise<FilterOptionsDto> {
    const [countries, departments, roles] = await Promise.all([
      this.countries.findAll(),
      this.departments.findAll(),
      this.roles.findAll(),
    ]);

    return { countries: countries.data, departments: departments.data, roles: roles.data };
  }
}
