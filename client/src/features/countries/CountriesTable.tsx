import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { Country } from './types';

export function CountriesTable({ rows }: { rows: Country[] }) {
  return (
    <div className="border-t">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-16">ID</TableHead>
            <TableHead>Name</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((country) => (
            <TableRow key={country.id}>
              <TableCell className="text-muted-foreground tabular-nums">{country.id}</TableCell>
              <TableCell className="font-medium">{country.name}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
