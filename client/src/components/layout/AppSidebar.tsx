import {
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

/** Navigation only: the app has no name to put above it, so there is no header. */
export function AppSidebar() {
  const { pathname } = useLocation();

  return (
    <Sidebar collapsible="icon">
      <SidebarContent className="pt-2">
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
