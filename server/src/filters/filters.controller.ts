import { Controller, Get } from '@nestjs/common';
import { FilterOptionsDto } from './dto/filter-options.dto';
import { FiltersService } from './filters.service';

@Controller('filters')
export class FiltersController {
  constructor(private readonly filtersService: FiltersService) {}

  @Get()
  findAll(): Promise<FilterOptionsDto> {
    return this.filtersService.findAll();
  }
}
