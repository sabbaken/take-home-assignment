import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Country, Department, Role } from '../database/entities';
import { FiltersController } from './filters.controller';
import { FiltersService } from './filters.service';

@Module({
  imports: [TypeOrmModule.forFeature([Country, Department, Role])],
  controllers: [FiltersController],
  providers: [FiltersService],
})
export class FiltersModule {}
