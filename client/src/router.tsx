import { createBrowserRouter, Navigate } from 'react-router';
import App from './App';
import { EmployeesPage } from '@/features/employees/EmployeesPage';
import { ReferencePage } from '@/features/reference/ReferencePage';
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
      { path: 'roles', element: <ReferencePage resource="roles" /> },
      { path: 'countries', element: <ReferencePage resource="countries" /> },
      { path: 'departments', element: <ReferencePage resource="departments" /> },
      { path: '*', element: <Navigate to={routes.employees} replace /> },
    ],
  },
]);
