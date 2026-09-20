import { createBrowserRouter, Navigate } from 'react-router';
import App from './App';
import { CountriesPage } from '@/features/countries/CountriesPage';
import { DepartmentsPage } from '@/features/departments/DepartmentsPage';
import { EmployeesPage } from '@/features/employees/EmployeesPage';
import { RolesPage } from '@/features/roles/RolesPage';
import { routes } from './routes';

// Employees is the screen the assignment asks for; the three lookup tables sit
// beside it as plain read-only lists. `/` and anything unknown land on employees.
export const router = createBrowserRouter([
  {
    path: '/',
    Component: App,
    children: [
      { index: true, element: <Navigate to={routes.employees} replace /> },
      { path: 'employees', Component: EmployeesPage },
      { path: 'roles', Component: RolesPage },
      { path: 'countries', Component: CountriesPage },
      { path: 'departments', Component: DepartmentsPage },
      { path: '*', element: <Navigate to={routes.employees} replace /> },
    ],
  },
]);
