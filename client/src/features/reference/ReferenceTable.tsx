import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { ReferenceRow } from './types';

export function ReferenceTable({ rows }: { rows: ReferenceRow[] }) {
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
          {rows.map((row) => (
            <TableRow key={row.id}>
              <TableCell className="text-muted-foreground tabular-nums">{row.id}</TableCell>
              <TableCell className="font-medium">{row.name}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
