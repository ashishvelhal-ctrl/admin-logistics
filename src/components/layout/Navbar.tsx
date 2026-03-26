import { Bell } from "lucide-react";

import Logo from "@/assets/Cropnest_logo.png";

export function Navbar() {
  return (
    <header className="h-16 bg-commonbg border-b flex items-center justify-between px-6">
      <div className="flex items-center  pl-5 pr-2 py-2 gap-3">
        <img src={Logo} alt="logo" className="w-8 h-8 rounded-full" />
        <div>
          <h1 className="font-semibold text-heading">CropNest</h1>
          <p className="text-xs text-inactive-text">Admin Panel</p>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <div className="relative cursor-pointer">
          <Bell className="w-5 h-5 text-inactive-text" />
          <span className="absolute -top-2 -right-2 bg-icon-text text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
            14
          </span>
        </div>
        <div className="flex items-center gap-3 pr-5">
          <div className="w-9 h-9 bg-icon-text text-white rounded-full flex items-center justify-center font-semibold">
            SA
          </div>
          <div>
            <p className="text-sm font-medium">Super Admin</p>
          </div>
        </div>
      </div>
    </header>
  );
}
