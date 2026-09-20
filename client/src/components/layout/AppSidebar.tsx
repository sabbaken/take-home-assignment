import {
  AddressBook,
  Buildings,
  GlobeHemisphereWest,
  IdentificationBadge,
  UsersThree,
  type Icon,
} from '@phosphor-icons/react';
import { Link, useLocation } from 'react-router';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar';
import { routes } from '@/routes';

interface NavItem {
  label: string;
  to: string;
  icon: Icon;
}

/**
 * The router is the other half of these lists: a new screen is an entry here, a
 * path in `routes.ts` and a route in `router.tsx`. The split mirrors the API —
 * employees is the screen the assignment asks for, the rest are the lookup
 * tables it filters by.
 */
const NAV_GROUPS: { label: string; items: NavItem[] }[] = [
  {
    label: 'Directory',
    items: [{ label: 'Employees', to: routes.employees, icon: UsersThree }],
  },
  {
    label: 'Reference data',
    items: [
      { label: 'Roles', to: routes.roles, icon: IdentificationBadge },
      { label: 'Countries', to: routes.countries, icon: GlobeHemisphereWest },
      { label: 'Departments', to: routes.departments, icon: Buildings },
    ],
  },
];

export function AppSidebar() {
  const { pathname } = useLocation();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to={routes.employees}>
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <AddressBook weight="fill" size={18} aria-hidden />
                </div>
                <span className="font-semibold tracking-tight">Directory</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {NAV_GROUPS.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.to}>
                    <SidebarMenuButton asChild isActive={pathname === item.to} tooltip={item.label}>
                      <Link to={item.to}>
                        <item.icon aria-hidden />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  );
}
