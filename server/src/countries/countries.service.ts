import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CollectionDto } from '../common/collection.dto';
import { Country } from '../database/entities';
import { nextId } from '../database/next-id';
import { CreateCountryDto } from './dto/create-country.dto';
import { UpdateCountryDto } from './dto/update-country.dto';

@Injectable()
export class CountriesService {
  constructor(@InjectRepository(Country) private readonly countries: Repository<Country>) {}

  /** Alphabetical: this list is rendered straight into a filter dropdown. */
  async findAll(): Promise<CollectionDto<Country>> {
    const data = await this.countries.find({ order: { name: 'ASC' } });

    return { data, total: data.length };
  }

  async findOne(id: number): Promise<Country> {
    const country = await this.countries.findOneBy({ id });

    if (!country) {
      throw new NotFoundException(`Country ${id} not found`);
    }

    return country;
  }

  async create(dto: CreateCountryDto): Promise<Country> {
    const country = this.countries.create({ id: await nextId(this.countries), name: dto.name });

    // `insert`, not `save`: `save` on a row whose id already exists would
    // update it, and a `POST` must never overwrite somebody else's row.
    await this.countries.insert(country);

    return country;
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
