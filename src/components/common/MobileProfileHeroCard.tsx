import { MapPin, PencilLine, Phone } from "lucide-react";

interface MobileProfileHeroCardProps {
  initials: string;
  name: string;
  phone: string;
  location: string;
  onEdit: () => void;
}

export function MobileProfileHeroCard({
  initials,
  name,
  phone,
  location,
  onEdit,
}: MobileProfileHeroCardProps) {
  return (
    <article className="rounded-2xl bg-[#2e7d68] px-4 py-3.5 text-white">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-white/20 border border-white/30 text-white flex items-center justify-center font-semibold text-base">
            {initials}
          </div>
          <div>
            <h2 className="text-[28px] font-semibold leading-tight">{name}</h2>
            <p className="text-[11px] text-white/90 mt-1 inline-flex items-center gap-1.5">
              <Phone className="w-3 h-3" /> {phone}
              <MapPin className="w-3 h-3 ml-1" /> {location}
            </p>
          </div>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-1 text-xs text-[#9ee6c9] mt-1 font-medium"
          onClick={onEdit}
        >
          <PencilLine className="w-3 h-3" />
          Edit Profile
        </button>
      </div>
    </article>
  );
}
