import { LoaderCircle, MapPin } from "lucide-react";

import { Input } from "@/components/ui/input";
import type { PlacesAutocompleteSuggestion } from "../services/googleLocationApi";
import type { LocationField } from "../types/trip";

type TripMapSearchFieldProps = {
  field: LocationField;
  value: string;
  loading: boolean;
  activeField: LocationField | null;
  suggestions: PlacesAutocompleteSuggestion[];
  placeholder: string;
  onChange: (field: LocationField, value: string) => void;
  onFocus: (field: LocationField) => void;
  onSelect: (
    field: LocationField,
    suggestion: PlacesAutocompleteSuggestion,
  ) => void;
};

export default function TripMapSearchField({
  field,
  value,
  loading,
  activeField,
  suggestions,
  placeholder,
  onChange,
  onFocus,
  onSelect,
}: TripMapSearchFieldProps) {
  return (
    <div className="relative">
      <Input
        value={value}
        onChange={(event) => onChange(field, event.target.value)}
        onFocus={() => onFocus(field)}
        type="text"
        placeholder={placeholder}
        className="h-11 border-border-stroke bg-common-bg pr-10"
      />

      {loading ? (
        <LoaderCircle className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-icon-1-color" />
      ) : null}

      {activeField === field && suggestions.length > 0 ? (
        <div className="absolute left-0 right-0 top-[calc(100%+0.35rem)] z-20 overflow-hidden rounded-xl border border-border-stroke bg-white shadow-lg">
          {suggestions.map((suggestion) => {
            const prediction = suggestion.placePrediction;

            return (
              <button
                key={prediction.placeId}
                type="button"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => onSelect(field, suggestion)}
                className="flex w-full items-start gap-3 border-b border-border-stroke px-4 py-3 text-left last:border-b-0 hover:bg-[#F8FAF9]"
              >
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#2E7D68]" />
                <span className="min-w-0">
                  <span className="block truncate text-sm font-medium text-heading-color">
                    {prediction.structuredFormat.mainText.text}
                  </span>
                  <span className="block truncate text-xs text-inactive-text">
                    {prediction.structuredFormat.secondaryText.text}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
