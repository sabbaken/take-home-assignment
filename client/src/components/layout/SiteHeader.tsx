import { UsersThree } from '@phosphor-icons/react';
import { Link, useLocation } from 'react-router';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu';
import { routes } from '@/routes';

// One entry per screen; the router is the other half of this list.
const NAV_ITEMS = [{ label: 'Employees', to: routes.employees }];

export function SiteHeader() {
  const { pathname } = useLocation();

  return (
    <header className="bg-background/80 sticky top-0 z-30 border-b backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-7xl items-center gap-6 px-4 sm:px-6">
        <Link
          to={routes.employees}
          className="flex shrink-0 items-center gap-2 text-sm font-semibold tracking-tight"
        >
          <UsersThree weight="fill" size={20} aria-hidden />
          Directory
        </Link>

        <NavigationMenu>
          <NavigationMenuList>
            {NAV_ITEMS.map((item) => (
              <NavigationMenuItem key={item.to}>
                <NavigationMenuLink
                  asChild
                  active={pathname === item.to}
                  className="text-muted-foreground data-[active]:text-foreground data-[active]:bg-accent inline-flex h-8 items-center rounded-md px-3 text-sm font-medium"
                >
                  <Link to={item.to}>{item.label}</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </header>
  );
}
