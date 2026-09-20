import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'departments' })
export class Department {
  @PrimaryColumn({ type: 'int' })
  id!: number;

  @Column({ type: 'varchar', length: 255 })
  name!: string;
}
