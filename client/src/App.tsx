import { IconContext } from '@phosphor-icons/react';
import { EmployeesPage } from '@/features/employees/EmployeesPage';

// One icon weight/size for the whole app instead of repeating props per icon.
const iconDefaults = { weight: 'regular', size: 18 } as const;

export default function App() {
  return (
    <IconContext.Provider value={iconDefaults}>
      <EmployeesPage />
    </IconContext.Provider>
  );
}
