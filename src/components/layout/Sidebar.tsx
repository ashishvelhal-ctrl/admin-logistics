import { useLocation, useNavigate } from "@tanstack/react-router";
import { useAtom } from "jotai";
import { LayoutDashboard, LogOut, Users } from "lucide-react";

import { authAtom } from "@/atoms/authAtom";
import { logout } from "@/lib/auth";

export function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [auth] = useAtom(authAtom);

  const menu = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      url: "/dashboard",
      activePaths: ["/dashboard"],
      roles: [
        "admin",
        "banner-manager",
        "crop-catalogue-manager",
        "asset-catalogue-manager",
        "area-catalogue-manager",
      ],
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

  const filteredMenu = menu.filter((item) =>
    item.roles.some((role) => auth?.roles?.includes(role)),
  );

  const handleLogout = () => {
    logout();
    navigate({ to: "/auth/login" });
  };

  return (
    <div className="flex flex-col justify-between h-full hidden md:flex">
      <div className="p-3 overflow-hidden flex-1 bg-common-bg">
        {filteredMenu.map((item, index) => {
          const Icon = item.icon;
          const isActive = item.activePaths.includes(location.pathname);

          return (
            <button
              key={index}
              onClick={() => navigate({ to: item.url })}
              className={`w-full flex items-center gap-3 pl-9 pr-2 py-2 rounded-lg mb-1 cursor-pointer transition-colors ${
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

      <div className="p-3 pl-6 border-t bg-common-bg">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 pl-9 pr-2 py-2 text-inactive-text hover:text-icon-2-color cursor-pointer transition-colors"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </div>
  );
}
