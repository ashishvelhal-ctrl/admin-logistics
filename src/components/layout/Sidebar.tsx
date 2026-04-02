import { useLocation, useNavigate } from "@tanstack/react-router";
import { useAtomValue } from "jotai";
import {
  ChartNoAxesCombined,
  LayoutDashboard,
  LogOut,
  User,
  Users,
  Users2,
} from "lucide-react";

import { authAtom } from "@/atoms/authAtom";
import { logout } from "@/lib/auth";

interface SidebarProps {
  variant: "admin" | "promoter";
  onNavigate?: () => void;
}

export function Sidebar({ variant, onNavigate }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const auth = useAtomValue(authAtom);
  const userName = auth?.user || "Raj Sharma";
  const initials =
    userName
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() || "")
      .join("") || "RS";

  const adminMenu = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      url: "/dashboard",
      activePaths: ["/dashboard"],
      roles: ["admin"],
    },
    {
      title: "Promoter Management",
      icon: Users,
      url: "/promoterList",
      activePaths: [
        "/promoterList",
        "/promoterForm",
        "/promoterEdit",
        "/promoterDetails",
      ],
      roles: ["admin"],
    },
    {
      title: "User Management",
      icon: Users,
      url: "/usersList",
      activePaths: ["/usersList", "/createUsers", "/editUsers", "/userDetails"],
      roles: ["admin"],
    },
  ];

  const promoterMenu = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      url: "/dashboardp",
      activePaths: [
        "/dashboardp",
        "/addUser",
        "/verifyUserOtp",
        "/drivingLicence",
        "/verifyDrivingLicence",
        "/addvehical",
        "/verificationVehical",
      ],
      roles: ["promoter"],
    },
    {
      title: "My Network",
      icon: Users2,
      url: "/myNetwork",
      activePaths: ["/myNetwork"],
      roles: ["promoter"],
    },
    {
      title: "My Performance",
      icon: ChartNoAxesCombined,
      url: "/myPerformance",
      activePaths: ["/myPerformance"],
      roles: ["promoter"],
    },
    {
      title: "My Profile",
      icon: User,
      url: "/myProfile",
      activePaths: ["/myProfile"],
      roles: ["promoter"],
    },
  ];

  const menu = variant === "admin" ? adminMenu : promoterMenu;

  const filteredMenu = menu.filter((item) =>
    item.roles.some((role) => auth?.roles?.includes(role)),
  );

  const handleLogout = () => {
    logout();
    onNavigate?.();
    navigate({ to: "/auth/login" });
  };

  return (
    <div className="flex flex-col justify-between h-full">
      <div className="p-3 overflow-hidden flex-1 bg-common-bg">
        {variant === "promoter" ? (
          <div className="mb-3 px-2 py-3 border-b border-border-stroke md:hidden">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-icon-text text-white flex items-center justify-center font-semibold text-sm">
                {initials}
              </div>
              <div>
                <p className="text-xl font-semibold text-heading-color leading-none">
                  {userName}
                </p>
                <p className="text-sm text-inactive-text mt-1">+91 9307154814</p>
              </div>
            </div>
          </div>
        ) : null}

        {filteredMenu.map((item, index) => {
          const Icon = item.icon;
          const isActive = item.activePaths.includes(location.pathname);

          return (
            <button
              key={index}
              onClick={() => {
                navigate({ to: item.url });
                onNavigate?.();
              }}
              className={`w-full flex items-center gap-3 pl-4 pr-2 py-2.5 rounded-lg mb-1 cursor-pointer transition-colors ${
                isActive
                  ? "bg-icon-bg text-icon-text font-medium"
                  : "text-inactive-text hover:bg-icon-bg hover:text-green-700"
              }`}
            >
              <Icon size={16} />
              {item.title}
            </button>
          );
        })}
      </div>

      <div className="p-3 border-t bg-common-bg">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 pl-4 pr-2 py-2 text-inactive-text hover:text-icon-2-color cursor-pointer transition-colors"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </div>
  );
}
