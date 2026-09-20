export interface FilterOptionDto {
  id: number;
  name: string;
}

export interface FilterOptionsDto {
  countries: FilterOptionDto[];
  departments: FilterOptionDto[];
  roles: FilterOptionDto[];
}
