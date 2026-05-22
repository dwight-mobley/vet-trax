import { type LucideIcon } from "lucide-react";
import Link from "next/link";


interface NavLinkProps {
  navItems: {name: string; href: string; icon: LucideIcon}[];
  pathname: string;
  setIsMobileMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export const NavLinks = ({ navItems, pathname, setIsMobileMenuOpen }: NavLinkProps) => (
  <nav className="space-y-1 mt-6">
    {navItems.map((item) => {
      const isActive = pathname === item.href;
      const Icon = item.icon;

      return (
        <Link
          key={item.name}
          href={item.href}
          onClick={() => setIsMobileMenuOpen(false)} // Close mobile menu on click
          className={`
              flex items-center gap-3 px-4 py-3 mx-3 rounded-medium transition-colors
              ${isActive ? "bg-primary/10 text-primary-dark font-medium" : "text-text-secondary hover:bg-background hover:text-text-primary"}
            `}>
          <Icon className={`w-5 h-5 ${isActive ? "text-primary" : "text-text-secondary"}`} />
          {item.name}
        </Link>
      );
    })}
  </nav>
);
