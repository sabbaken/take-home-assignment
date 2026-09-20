import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Country } from './entities/country.entity';
import { CountriesController } from './countries.controller';
import { CountriesService } from './countries.service';

@Module({
  imports: [TypeOrmModule.forFeature([Country])],
  controllers: [CountriesController],
  providers: [CountriesService],
  // Exported so `FiltersModule` can reuse the service instead of reaching for
  // the repository a second time.
  exports: [CountriesService],
})
export class CountriesModule {}
