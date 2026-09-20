import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Country } from '../../countries/entities/country.entity';
import { Department } from '../../departments/entities/department.entity';
import { Role } from '../../roles/entities/role.entity';

@Entity({ name: 'employees' })
export class Employee {
  @PrimaryGeneratedColumn({ type: 'int' })
  id!: number;

  @Column({ name: 'first_name', type: 'varchar', length: 255 })
  firstName!: string;

  @Column({ name: 'last_name', type: 'varchar', length: 255 })
  lastName!: string;

  @ManyToOne(() => Role)
  @JoinColumn({ name: 'role_id' })
  role!: Role | null;

  @ManyToOne(() => Country)
  @JoinColumn({ name: 'country_id' })
  country!: Country | null;

  @ManyToOne(() => Department)
  @JoinColumn({ name: 'department_id' })
  department!: Department | null;
}
