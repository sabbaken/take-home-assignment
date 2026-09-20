import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { Role } from './types';

export function RolesTable({ rows }: { rows: Role[] }) {
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
          {rows.map((role) => (
            <TableRow key={role.id}>
              <TableCell className="text-muted-foreground tabular-nums">{role.id}</TableCell>
              <TableCell className="font-medium">{role.name}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
