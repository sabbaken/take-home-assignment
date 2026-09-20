import { IconContext } from '@phosphor-icons/react';
import { Outlet } from 'react-router';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

// One icon weight/size for the whole app instead of repeating props per icon.
const iconDefaults = { weight: 'regular', size: 18 } as const;

export default function App() {
  return (
    <IconContext.Provider value={iconDefaults}>
      <SidebarProvider>
        <AppSidebar />
        {/* Each page opens with its own <PageHeader />, so the layout stops here. */}
        <SidebarInset>
          <Outlet />
        </SidebarInset>
      </SidebarProvider>
    </IconContext.Provider>
  );
}
