import type { ReactNode } from "react";
import { ShieldCheck } from "lucide-react";

interface LeftHeroSectionProps {
  children?: ReactNode;
  title?: string;
  subtitle?: string;
  brandLabel?: string;
  glassText?: string;
  glassSubText?: string;
}
//Add global css colors after the Confirmation
export function LeftHeroSection({
  title = "Fast & Secure Verification",
  subtitle = "Verify your identity to continue securely and access your personalized dashboard.",
  brandLabel = "CROPNEST",
  glassText,
  glassSubText,
}: LeftHeroSectionProps) {
  return (
    <div className="bg-login-color px-5 pt-10 pb-6 md:flex md:items-start md:justify-start md:pt-28 md:pl-24 md:pr-8 md:pb-10">
      <div className="text-white max-w-xl text-left md:pt-20">
        <div className="text-[11px] md:text-2xl tracking-[0.28em] md:tracking-[0.35em] font-semibold text-[#FFFFFF] mb-4 md:mb-6">
          {brandLabel}
        </div>

        <h1 className="text-4xl md:text-5xl font-extrabold leading-[1.1] text-[#AEF2DC] mb-3 md:mb-6">
          {title}
        </h1>

        <p className="text-xs md:text-lg text-[#AEF2DC] leading-relaxed mb-5 md:mb-10">
          {subtitle}
        </p>

        <div className="w-full rounded-xl border border-white/15 bg-white/5 backdrop-blur-sm p-4 md:p-6">
          <div className="flex items-center gap-2 md:gap-3 mb-1 md:mb-2">
            <ShieldCheck className="text-[#AEF2DC] w-4 h-4 md:w-5 md:h-5" />
            <h3 className="font-semibold mb-1 text-[#AEF2DC] text-xs md:text-base">
              {glassText}
            </h3>
          </div>
          <p className="text-white/70 text-[10px] md:text-sm text-[#AEF2DC]">
            {glassSubText}
          </p>
        </div>
      </div>
    </div>
  );
}
