import { useNavigate } from "@tanstack/react-router";
import { useAtomValue } from "jotai/react";
import { useEffect, useState } from "react";

import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";

import type { ReactNode } from "react";

import { tokenAtom } from "@/feature/auth/state/token";

interface LayoutProps {
  children: ReactNode;
  variant: "admin" | "promoter";
}

const Spinner = () => {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="w-8 h-8 border-4 border-border-stroke border-t-green-600 rounded-full animate-spin" />
    </div>
  );
};

export function Layout({ children, variant }: LayoutProps) {
  const navigate = useNavigate();
  const token = useAtomValue(tokenAtom);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check both token atom and auth storage
    const authStorage = sessionStorage.getItem("auth");
    let storageToken: string | null = null;

    if (authStorage) {
      try {
        storageToken = JSON.parse(authStorage).token || null;
      } catch {
        storageToken = null;
      }
    }

    const hasToken = token?.access || storageToken;

    if (!hasToken) {
      navigate({ to: "/auth/login" });
      return;
    }

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 200);

    return () => clearTimeout(timer);
  }, [token, navigate]);

  return (
    <div className="h-screen flex flex-col">
      <header className="h-16 bg-common-bg border-b border-border-stroke flex-shrink-0">
        <Navbar variant={variant} />
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-75 border-r border-border-stroke flex-shrink-0 overflow-y-auto">
          <Sidebar variant={variant} />
        </aside>

        <main className="flex-1 overflow-y-auto">
          <div className="p-1 bg-common-bg min-h-full">
            {isLoading ? <Spinner /> : children}
          </div>
        </main>
      </div>
    </div>
  );
}
