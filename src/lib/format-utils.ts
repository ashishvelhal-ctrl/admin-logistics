// Utility functions for formatting and string manipulation

export function formatDate(
  dateString: string,
  options?: { locale?: string; invalidValue?: string },
): string {
  if (!dateString || dateString === "1800-01-01T00:00:00.000Z") {
    return options?.invalidValue ?? "N/A";
  }

  try {
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) {
      return options?.invalidValue ?? "N/A";
    }
    return date.toLocaleDateString(options?.locale ?? "en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return options?.invalidValue ?? "Invalid Date";
  }
}

export function sentenceWords(str: string): string {
  if (!str) return "";

  return str
    .split(/[-_]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}
