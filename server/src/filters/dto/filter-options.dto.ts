/** Same pair of columns every reference table has; named for how the client uses it. */
export interface FilterOptionDto {
  id: number;
  name: string;
}

export interface FilterOptionsDto {
  countries: FilterOptionDto[];
  departments: FilterOptionDto[];
  roles: FilterOptionDto[];
}
