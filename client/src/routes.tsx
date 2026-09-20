import { createBrowserRouter, Navigate } from 'react-router';
import App from './App';
import { EmployeesPage } from '@/features/employees/EmployeesPage';

// Every path the app knows, in one place, so links never hard-code a string.
export const routes = {
  employees: '/employees',
} as const;

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
