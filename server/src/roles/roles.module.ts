import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from '../database/entities';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';

@Module({
  imports: [TypeOrmModule.forFeature([Role])],
  controllers: [RolesController],
  providers: [RolesService],
  // Exported so `FiltersModule` can reuse the service instead of reaching for
  // the repository a second time.
  exports: [RolesService],
})
export class RolesModule {}
