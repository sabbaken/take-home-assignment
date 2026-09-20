import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import type { EmployeeRow } from './types';

interface EmployeesTableProps {
  rows: EmployeeRow[];
  /** True while a new filter combination is in flight and rows are still the previous ones. */
  isStale?: boolean;
}

/** Relation columns are nullable in the schema — render a dash rather than an empty cell. */
const renderValue = (value: string | null) =>
  value ?? <span className="text-muted-foreground">—</span>;

export function EmployeesTable({ rows, isStale = false }: EmployeesTableProps) {
  return (
    <div
      className={cn(
        'bg-card overflow-hidden rounded-xl border transition-opacity',
        isStale && 'opacity-60',
      )}
    >
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-16">ID</TableHead>
            <TableHead>First name</TableHead>
            <TableHead>Last name</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Country</TableHead>
            <TableHead>Department</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((employee) => (
            <TableRow key={employee.id}>
              <TableCell className="text-muted-foreground tabular-nums">{employee.id}</TableCell>
              <TableCell className="font-medium">{employee.firstName}</TableCell>
              <TableCell className="font-medium">{employee.lastName}</TableCell>
              <TableCell>{renderValue(employee.role)}</TableCell>
              <TableCell>{renderValue(employee.country)}</TableCell>
              <TableCell>{renderValue(employee.department)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
