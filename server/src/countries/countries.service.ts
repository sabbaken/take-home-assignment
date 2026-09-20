import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Country } from '../database/entities';
import { CreateCountryDto } from './dto/create-country.dto';
import { UpdateCountryDto } from './dto/update-country.dto';

@Injectable()
export class CountriesService {
  constructor(@InjectRepository(Country) private readonly countries: Repository<Country>) {}

  /** Alphabetical: this list is rendered straight into a filter dropdown. */
  findAll(): Promise<Country[]> {
    return this.countries.find({ order: { name: 'ASC' } });
  }

  async findOne(id: number): Promise<Country> {
    const country = await this.countries.findOneBy({ id });

    if (!country) {
      throw new NotFoundException(`Country ${id} not found`);
    }

    return country;
  }

  create(dto: CreateCountryDto): Promise<Country> {
    return this.countries.save(this.countries.create(dto));
  }

  async update(id: number, dto: UpdateCountryDto): Promise<Country> {
    const country = await this.findOne(id);

    // `undefined` on a PATCH means "leave the stored name alone".
    if (dto.name !== undefined) {
      country.name = dto.name;
    }

    return this.countries.save(country);
  }

  async remove(id: number): Promise<void> {
    // Look before deleting: `DELETE` on a row that was never there reports the
    // same nothing as a successful one, and that case owes the caller a 404.
    await this.findOne(id);

    await this.countries.delete(id);
  }
}
