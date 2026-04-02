import type { ChangeEvent, ClipboardEvent, KeyboardEvent } from "react";

interface SixDigitOtpInputProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  inputClassName?: string;
}

export function SixDigitOtpInput({
  value,
  onChange,
  className = "flex gap-2 md:gap-3 justify-center",
  inputClassName = "w-10 h-10 md:w-12 md:h-12 rounded-md md:rounded-lg bg-gray-100 text-center text-base md:text-lg font-semibold focus:ring-2 focus:ring-icon-1-color outline-none border border-gray-300",
}: SixDigitOtpInputProps) {
  const handleDigitChange =
    (index: number) => (e: ChangeEvent<HTMLInputElement>) => {
      const nextChar = e.target.value;
      if (nextChar && !/^\d$/.test(nextChar)) return;

      const next = value.split("");
      next[index] = nextChar;
      const nextOtp = next.join("").slice(0, 6);
      onChange(nextOtp);

      if (nextChar && index < 5) {
        const nextInput = e.currentTarget
          .nextElementSibling as HTMLInputElement | null;
        nextInput?.focus();
      }
    };

  const handleKeyDown =
    (index: number) => (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key !== "Backspace") return;

      if (value[index]) {
        const next = value.split("");
        next[index] = "";
        onChange(next.join("").slice(0, 6));
      } else if (index > 0) {
        const prevInput = e.currentTarget
          .previousElementSibling as HTMLInputElement | null;
        prevInput?.focus();
      }
    };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const digits = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    if (digits.length === 6) onChange(digits);
  };

  return (
    <div className={className}>
      {[0, 1, 2, 3, 4, 5].map((index) => (
        <input
          key={index}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[index] || ""}
          onChange={handleDigitChange(index)}
          onKeyDown={handleKeyDown(index)}
          onPaste={handlePaste}
          className={inputClassName}
        />
      ))}
    </div>
  );
}
