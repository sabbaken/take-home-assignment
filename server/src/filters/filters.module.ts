import { Module } from '@nestjs/common';
import { CountriesModule } from '../countries/countries.module';
import { DepartmentsModule } from '../departments/departments.module';
import { RolesModule } from '../roles/roles.module';
import { FiltersController } from './filters.controller';
import { FiltersService } from './filters.service';

@Module({
  imports: [CountriesModule, DepartmentsModule, RolesModule],
  controllers: [FiltersController],
  providers: [FiltersService],
})
export class FiltersModule {}
