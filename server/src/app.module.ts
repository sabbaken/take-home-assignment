import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validateEnv } from './config/env.validation';
import { CountriesModule } from './countries/countries.module';
import { DatabaseModule } from './database/database.module';
import { DepartmentsModule } from './departments/departments.module';
import { EmployeesModule } from './employees/employees.module';
import { FiltersModule } from './filters/filters.module';
import { RolesModule } from './roles/roles.module';

@Module({
  imports: [
    // Reads server/.env and refuses to boot on a missing or malformed value.
    ConfigModule.forRoot({ isGlobal: true, validate: validateEnv }),
    DatabaseModule,
    // One module per resource, plus `FiltersModule` — the aggregate the table's
    // filter bar reads.
    CountriesModule,
    DepartmentsModule,
    EmployeesModule,
    RolesModule,
    FiltersModule,
  ],
})
export class AppModule {}
