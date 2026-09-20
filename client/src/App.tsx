import { IconContext } from '@phosphor-icons/react';
import { Outlet } from 'react-router';
import { SiteHeader } from '@/components/layout/SiteHeader';

// One icon weight/size for the whole app instead of repeating props per icon.
const iconDefaults = { weight: 'regular', size: 18 } as const;

export default function App() {
  return (
    <IconContext.Provider value={iconDefaults}>
      <div className="min-h-screen">
        <SiteHeader />
        <Outlet />
      </div>
    </IconContext.Provider>
  );
}
