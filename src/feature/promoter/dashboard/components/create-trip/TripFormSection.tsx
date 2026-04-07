import type { ReactNode } from "react";

type TripFormSectionProps = {
  title: string;
  children: ReactNode;
  allowOverflow?: boolean;
};

export default function TripFormSection({
  title,
  children,
  allowOverflow = false,
}: TripFormSectionProps) {
  return (
    <article
      className={`rounded-2xl border border-border-stroke bg-white shadow-[0_8px_24px_rgba(15,23,42,0.04)] ${
        allowOverflow ? "overflow-visible" : "overflow-hidden"
      }`}
    >
      <div className="border-b border-border-stroke px-5 py-4 md:px-8">
        <h2 className="text-[28px] font-semibold leading-none text-heading-color md:text-[30px]">
          {title}
        </h2>
      </div>
      <div className="p-5 md:p-8">{children}</div>
    </article>
  );
}
