
import { BrainCircuit, Home, CheckSquare, BarChart3, BookOpen } from "lucide-react";
import { LucideIcon } from "lucide-react";

export interface MenuItem {
  icon: LucideIcon;
  label: string;
  href: string;
  hasChildren: boolean;
}

export const menuItems: MenuItem[] = [
  {
    icon: Home,
    label: "Dashboard",
    href: "/",
    hasChildren: false
  }, 
  {
    icon: BrainCircuit,
    label: "Ideation",
    href: "/ideation",
    hasChildren: true
  }, 
  {
    icon: CheckSquare,
    label: "Tasks",
    href: "/tasks",
    hasChildren: false
  }, 
  {
    icon: BarChart3,
    label: "Portfolio",
    href: "/portfolio",
    hasChildren: true
  }, 
  {
    icon: BookOpen,
    label: "Resources",
    href: "/resources",
    hasChildren: false
  }
];
