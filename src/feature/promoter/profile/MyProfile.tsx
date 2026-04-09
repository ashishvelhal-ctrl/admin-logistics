import { useNavigate } from "@tanstack/react-router";
import { useAtomValue } from "jotai";
import {
  MapPin,
  PencilLine,
  Phone,
  Search,
  SlidersHorizontal,
  UserRound,
} from "lucide-react";
import { useMemo } from "react";

import { authAtom } from "@/atoms/authAtom";
import { MobileProfileHeroCard } from "@/components/common/MobileProfileHeroCard";
import {
  MobileNetworkCardList,
  type MobileNetworkCardItem,
} from "@/components/common/MobileNetworkCardList";
import { MobileThreeStats } from "@/components/common/MobileThreeStats";
export default function MyProfile() {
  const navigate = useNavigate();
  const auth = useAtomValue(authAtom);
  const name = auth?.user || "Raj Sharma";
  const initials =
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() || "")
      .join("") || "PR";
  const roleLabel = auth?.roles?.[0] || "promoter";
  const mobile = "9307154814";
  const address = "Pune";

  const mobileNetworkUsers = useMemo(
    () =>
      Array.from({ length: 5 }, (_, index) => ({
        id: `profile-network-${index + 1}`,
        userName: "Arjun Mehta",
        phone: "+91 98765 43210",
        date: "OCT 24, 2023",
        location: "Maharashtra",
      })),
    [],
  );
  const mobileCardItems: MobileNetworkCardItem[] = mobileNetworkUsers.map(
    (user) => ({
      id: user.id,
      name: user.userName,
      phone: user.phone,
      dateText: user.date,
      locationText: user.location,
    }),
  );

  return (
    <main className="pt-2 px-3 md:pr-10 md:pl-4 pb-4 space-y-4 bg-common-bg min-h-full">
      <section className="md:hidden">
        <MobileProfileHeroCard
          initials={initials}
          name={name}
          phone={`+91 ${mobile}`}
          location={address}
          onEdit={() =>
            navigate({
              to: "/editProfile",
              search: {
                fullName: name,
                mobileNumber: mobile,
                assignedAddress: address,
              },
            })
          }
        />
      </section>

      <section className="md:hidden">
        <MobileThreeStats
          stats={[
            {
              label: "Total Onboard",
              value: "2,450",
              change: "+12% this month",
            },
            {
              label: "Total Earnings",
              value: "₹12,000",
              change: "+12% this month",
            },
            {
              label: "Target Goal",
              value: "15/Month",
              change: "+12% this month",
            },
          ]}
        />
      </section>

      <section className="md:hidden">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-[35px] font-semibold text-heading-color">
            My Network
          </h3>
          <SlidersHorizontal className="w-4 h-4 text-inactive-text" />
        </div>
        <div className="mt-3 mb-3 relative">
          <Search className="w-4 h-4 text-inactive-text absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name or number..."
            className="w-full h-10 rounded-full border border-border-stroke bg-[#f1f4f3] pl-10 pr-3 text-sm outline-none"
          />
        </div>
        <MobileNetworkCardList
          items={mobileCardItems}
          size="large"
          editStyle="icon"
        />
      </section>

      <section className="hidden md:block px-8">
        <h1 className="text-2xl font-semibold text-heading-color">
          My Profile
        </h1>
        <p className="text-sm text-inactive-text mt-1">
          View your account details and current role access.
        </p>
      </section>

      <section className="hidden md:block px-8">
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
            <button
              type="button"
              className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1 rounded-full bg-icon-bg text-icon-text uppercase w-fit"
              onClick={() =>
                navigate({
                  to: "/editProfile",
                  search: {
                    fullName: name,
                    mobileNumber: mobile,
                    assignedAddress: address,
                  },
                })
              }
            >
              <PencilLine className="w-4 h-4" />
              Edit
            </button>
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
                +91 {mobile}
              </p>
            </div>
            <div className="border border-border-stroke rounded-lg p-4 md:col-span-2">
              <p className="text-xs uppercase tracking-wide text-inactive-text">
                Access Control
              </p>
              <p className="text-sm text-heading-color mt-1 flex items-center gap-2 capitalize">
                <MapPin className="w-4 h-4 text-icon-text" />
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
