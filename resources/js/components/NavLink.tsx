import { Link, type InertiaLinkProps, usePage } from "@inertiajs/react";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface NavLinkCompatProps extends Omit<InertiaLinkProps, "className" | "href"> {
  href: string;
  className?: string;
  activeClassName?: string;
}

const NavLink = forwardRef<HTMLAnchorElement, NavLinkCompatProps>(
  ({ className, activeClassName, href, ...props }, ref) => {
    const { url } = usePage();
    const currentPath = url.split("?")[0];
    const isActive =
      currentPath === href || (href !== "/" && currentPath.startsWith(`${href}/`));

    return (
      <Link
        ref={ref}
        href={href}
        className={cn(className, isActive && activeClassName)}
        {...props}
      />
    );
  },
);

NavLink.displayName = "NavLink";

export { NavLink };
