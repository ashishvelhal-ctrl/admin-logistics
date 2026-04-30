import { CheckIcon } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface SearchAndFilterProps {
  searchLabel: string;
  searchPlaceholder: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  selectLabel: string;
  selectPlaceholder: string;
  selectValue: string;
  onSelectChange: (value: string) => void;
  selectOptions: Array<{ value: string; label: string }>;
}

export function SearchAndFilter({
  searchLabel,
  searchPlaceholder,
  searchValue,
  onSearchChange,
  selectLabel,
  selectPlaceholder,
  selectValue,
  onSelectChange,
  selectOptions,
}: SearchAndFilterProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const filteredOptions = selectOptions.filter((option) =>
    option.label.toLowerCase().includes(query.toLowerCase()),
  );

  const selectedOption = selectOptions.find(
    (option) => option.value === selectValue,
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      {/* Search Input */}
      <div>
        <label className="text-sm text-muted-foreground">{searchLabel}</label>
        <input
          className="mt-1 w-full bg-common-bg border-2 border-border-stroke rounded-md px-3 py-2 text-sm"
          placeholder={searchPlaceholder}
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      {/* Select Dropdown */}
      <div>
        <label className="text-sm text-text-color">{selectLabel}</label>

        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="mt-1 w-full h-10 justify-between bg-common-bg border-2 border-border-stroke rounded-md px-3 text-text-color font-medium"
            >
              {selectedOption?.label ?? selectPlaceholder}
            </Button>
          </PopoverTrigger>

          <PopoverContent
            align="start"
            side="bottom"
            className="z-50 p-0 w-full"
          >
            <Command>
              <CommandInput
                placeholder="Search..."
                value={query}
                onValueChange={setQuery}
              />

              <CommandList>
                <CommandEmpty>No results</CommandEmpty>

                <CommandGroup>
                  {filteredOptions.map((option) => (
                    <CommandItem
                      key={option.value}
                      value={option.label}
                      onSelect={() => {
                        onSelectChange(option.value);
                        setOpen(false);
                      }}
                    >
                      <CheckIcon
                        className={`mr-2 size-4 ${
                          selectValue === option.value
                            ? "opacity-100"
                            : "opacity-0"
                        }`}
                      />
                      {option.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
