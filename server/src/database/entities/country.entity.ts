import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'countries' })
export class Country {
  @PrimaryColumn({ type: 'int' })
  id!: number;

  @Column({ type: 'varchar', length: 255 })
  name!: string;
}
