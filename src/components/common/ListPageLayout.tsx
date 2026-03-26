import React from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ListPageLayoutProps {
  title: string;
  description: string;
  children: React.ReactNode;
  isLoading?: boolean;
  error?: string | null;
  showSearch?: boolean;
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  showFilter?: boolean;
  filterOptions?: Array<{ value: string; label: string }>;
  filterValue?: string;
  onFilterChange?: (value: string) => void;
  filterPlaceholder?: string;
  showAddButton?: boolean;
  addButtonText?: string;
  onAddClick?: () => void;
  emptyMessage?: string;
  emptyActionText?: string;
  onEmptyActionClick?: () => void;
  showEmptyAction?: boolean;
}

export function ListPageLayout({
  title,
  description,
  children,
  isLoading = false,
  error = null,
  showSearch = true,
  searchPlaceholder = "Search...",
  searchValue = "",
  onSearchChange,
  showFilter = false,
  filterOptions = [],
  filterValue = "",
  onFilterChange,
  filterPlaceholder = "Filter...",
  emptyMessage = "No items found.",
  emptyActionText = "Add First Item",
  onEmptyActionClick,
  showEmptyAction = false,
}: ListPageLayoutProps) {
  const hasActiveFilters =
    searchValue.trim() || (filterValue && filterValue !== "all");

  return (
    <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <Card className="mx-4">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>

          {(showSearch || showFilter) && (
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              {showSearch && (
                <div className="flex-1">
                  <Input
                    placeholder={searchPlaceholder}
                    value={searchValue}
                    onChange={(e) => onSearchChange?.(e.target.value)}
                    className="w-full"
                  />
                </div>
              )}
              {showFilter && (
                <div className="w-full sm:w-48">
                  <Select value={filterValue} onValueChange={onFilterChange}>
                    <SelectTrigger>
                      <SelectValue placeholder={filterPlaceholder} />
                    </SelectTrigger>
                    <SelectContent>
                      {filterOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          )}
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3"></div>
              <span className="text-gray-600">Loading...</span>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-600">Error loading data</p>
              <p className="text-sm text-gray-500">{error}</p>
            </div>
          ) : React.Children.count(children) === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">
                {hasActiveFilters
                  ? "No items match your search/filter criteria."
                  : emptyMessage}
              </p>
              {showEmptyAction && onEmptyActionClick && (
                <Button className="mt-4" onClick={onEmptyActionClick}>
                  {emptyActionText}
                </Button>
              )}
            </div>
          ) : (
            children
          )}
        </CardContent>
      </Card>
    </main>
  );
}
