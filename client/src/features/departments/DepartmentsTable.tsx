import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { Department } from './types';

export function DepartmentsTable({ rows }: { rows: Department[] }) {
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
          {rows.map((department) => (
            <TableRow key={department.id}>
              <TableCell className="text-muted-foreground tabular-nums">{department.id}</TableCell>
              <TableCell className="font-medium">{department.name}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
