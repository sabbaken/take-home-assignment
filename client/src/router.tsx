import { createBrowserRouter, Navigate } from 'react-router';
import App from './App';
import { EmployeesPage } from '@/features/employees/EmployeesPage';
import { routes } from './routes';

// Employees is the only screen so far; `/` and anything unknown land on it.
export const router = createBrowserRouter([
  {
    path: '/',
    Component: App,
    children: [
      { index: true, element: <Navigate to={routes.employees} replace /> },
      { path: 'employees', Component: EmployeesPage },
      { path: '*', element: <Navigate to={routes.employees} replace /> },
    ],
  },
]);
