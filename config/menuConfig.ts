import {
  Home,
  Users,
  CircleUserRound,
  CalendarDays,
  BarChart3,
  FileText,
  Settings,
  UserRound,
  ShoppingCart,
} from "lucide-react";

export type UserRole = "staff" | "super_admin";

export interface MenuItem {
  label: string;
  href?: string;
  icon: React.ElementType;
  roles: UserRole[];

  children?: {
    label: string;
    href: string;
    roles: UserRole[];
  }[];
}

export const menuItems: MenuItem[] = [
  // ==========================================================
  // DASHBOARD
  // ==========================================================
  {
    label: "Dashboard",
    href: "/home",
    icon: Home,
    roles: ["staff", "super_admin"],
  },

  // ==========================================================
  // LEADS
  // ==========================================================
  {
    label: "Leads",
    icon: Users,
    roles: ["staff", "super_admin"],

    children: [
      {
        label: "All Leads",
        href: "/leads",
        roles: ["staff", "super_admin"],
      },
      {
        label: "Follow-ups",
        href: "/leads/follow-ups",
        roles: ["staff", "super_admin"],
      },
      {
        label: "Confirmed",
        href: "/leads/confirmed",
        roles: ["staff", "super_admin"],
      },
      {
        label: "Contacts",
        href: "/leads/contacts",
        roles: ["staff", "super_admin"],
      },
    ],
  },

  // ==========================================================
  // CUSTOMERS
  // ==========================================================
  {
    label: "Customers",
    icon: UserRound,
    roles: ["staff", "super_admin"],

    children: [
      {
        label: "All Customers",
        href: "/customers",
        roles: ["staff", "super_admin"],
      },
      {
        label: "Active Customers",
        href: "/customers/active",
        roles: ["staff", "super_admin"],
      },
    ],
  },

  // ==========================================================
  // ADMIN ONLY
  // ==========================================================
  {
    label: "Staff",
    href: "/staff",
    icon: CircleUserRound,
    roles: ["super_admin"],
  },

  {
    label: "Reports",
    href: "/reports",
    icon: BarChart3,
    roles: ["super_admin"],
  },

  {
    label: "Activity",
    href: "/activity",
    icon: FileText,
    roles: ["super_admin"],
  },

  {
    label: "Settings",
    href: "/settings",
    icon: Settings,
    roles: ["super_admin"],
  },
];
