import type { ReactNode } from "react";
import { ShieldCheck } from "lucide-react";

interface LeftHeroSectionProps {
  children: ReactNode
  title?: string
  subtitle?: string
  brandLabel?: string
  glassText?: string
  glassSubText?: string
}
//Add global css colors after the Confirmation 
export function LeftHeroSection({ 
  children, 
  title = "Fast & Secure Verification",
  subtitle = "Verify your identity to continue securely and access your personalized dashboard.",
  brandLabel = "CROPNEST",
  glassText,
  glassSubText
}: LeftHeroSectionProps) {
  return (
    <div className="hidden md:flex bg-login-color items-start justify-start pt-28 pl-24">
      <div className="text-white max-w-xl text-left pt-20">
        <div className="text-2xl tracking-[0.35em] font-semibold text-[#FFFFFF] mb-6">
          {brandLabel}
        </div>

        <h1 className="text-5xl font-extrabold leading-[1.1] text-[#AEF2DC] mb-6">
          {title}
        </h1>

        <p className="text-lg text-[#AEF2DC] leading-relaxed mb-10">
          {subtitle}
        </p>

        <div className="w-full rounded-xl border border-white/15 bg-white/5 backdrop-blur-sm p-6">
          <div className="flex items-center gap-3 mb-2">
            <ShieldCheck className="text-[#AEF2DC]" />
            <h3 className="font-semibold mb-1 text-[#AEF2DC]">{glassText}</h3>
          </div>
          <p className="text-white/70 text-sm text-[#AEF2DC]">
            {glassSubText}
          </p>
        </div>
      </div>
    </div>
  );
}
