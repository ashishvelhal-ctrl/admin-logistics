import { useAtomValue } from "jotai";
import { BadgeCheck, Phone, ShieldCheck, UserRound } from "lucide-react";

import { authAtom } from "@/atoms/authAtom";

export default function MyProfile() {
  const auth = useAtomValue(authAtom);
  const name = auth?.user || "Promoter User";
  const roleLabel = auth?.roles?.[0] || "promoter";
  const initials =
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() || "")
      .join("") || "PR";

  return (
    <main className="pt-1 pr-10 pl-4 space-y-6">
      <section className="px-8">
        <h1 className="text-2xl font-semibold text-heading-color">
          My Profile
        </h1>
        <p className="text-sm text-inactive-text mt-1">
          View your account details and current role access.
        </p>
      </section>

      <section className="px-8">
        <article className="bg-white border border-border-stroke rounded-xl shadow-sm p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-icon-text text-white flex items-center justify-center text-lg font-semibold">
                {initials}
              </div>
              <div>
                <p className="text-xl font-semibold text-heading-color">
                  {name}
                </p>
                <p className="text-sm text-inactive-text capitalize">
                  {roleLabel.replaceAll("-", " ")}
                </p>
              </div>
            </div>
            <span className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1 rounded-full bg-icon-bg text-icon-text uppercase w-fit">
              <BadgeCheck className="w-4 h-4" />
              Active
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="border border-border-stroke rounded-lg p-4">
              <p className="text-xs uppercase tracking-wide text-inactive-text">
                User Name
              </p>
              <p className="text-sm text-heading-color mt-1 flex items-center gap-2">
                <UserRound className="w-4 h-4 text-icon-text" />
                {name}
              </p>
            </div>
            <div className="border border-border-stroke rounded-lg p-4">
              <p className="text-xs uppercase tracking-wide text-inactive-text">
                Contact
              </p>
              <p className="text-sm text-heading-color mt-1 flex items-center gap-2">
                <Phone className="w-4 h-4 text-icon-text" />
                +91 XXXXX XXXXX
              </p>
            </div>
            <div className="border border-border-stroke rounded-lg p-4 md:col-span-2">
              <p className="text-xs uppercase tracking-wide text-inactive-text">
                Access Control
              </p>
              <p className="text-sm text-heading-color mt-1 flex items-center gap-2 capitalize">
                <ShieldCheck className="w-4 h-4 text-icon-text" />
                {auth?.roles?.length
                  ? auth.roles.join(", ").replaceAll("-", " ")
                  : "promoter"}
              </p>
            </div>
          </div>
        </article>
      </section>
    </main>
  );
}
