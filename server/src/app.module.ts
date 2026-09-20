import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validateEnv } from './config/env.validation';
import { DatabaseModule } from './database/database.module';
import { EmployeesModule } from './employees/employees.module';
import { FiltersModule } from './filters/filters.module';

@Module({
  imports: [
    // Reads server/.env and refuses to boot on a missing or malformed value.
    ConfigModule.forRoot({ isGlobal: true, validate: validateEnv }),
    DatabaseModule,
    EmployeesModule,
    FiltersModule,
  ],
})
export class AppModule {}
