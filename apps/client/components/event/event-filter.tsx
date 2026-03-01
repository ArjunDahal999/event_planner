/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { cn } from "@/lib/utils";
import { RotateCcwIcon, Loader2Icon } from "lucide-react";
import { Button } from "../ui/button";
import { EventFilters, useEventFilters } from "./use-filter.hook";
import { useState, Suspense, useEffect } from "react";

type TextFilterKey = keyof EventFilters;
type EventTypeOption = {
  label: string;
  value: string;
  key: keyof EventFilters;
};

const TEXT_FILTER_OPTIONS: { label: string; value: keyof EventFilters }[] = [
  { label: "Title", value: "title" },
  { label: "Description", value: "description" },
  { label: "Location", value: "location" },
  { label: "Tags", value: "tags" },
];

const EVENT_TYPE_OPTIONS: EventTypeOption[] = [
  { label: "Public Events", value: "public", key: "eventType" },
  { label: "Private Events", value: "private", key: "eventType" },
  { label: "Past Events", value: "past", key: "eventTimeLine" },
  { label: "Upcoming Events", value: "upcoming", key: "eventTimeLine" },
];

const EventFilterInner = () => {
  const { filters, updateFilters, isPending, resetFilters } = useEventFilters();
  const filtersPresentInSearchParams = Object.entries(filters).filter(
    ([_, v]) => v != null,
  );
  const activeFilters = filtersPresentInSearchParams
    .filter(([_, v]) => !Number.isInteger(v)) //  page and limit to be in filter
    .map(([k]) => k);
  const appliedFilters: Partial<Record<TextFilterKey, string>> =
    Object.fromEntries(filtersPresentInSearchParams);
  const [activeFilterTypes, setActiveFilterTypes] = useState<TextFilterKey[]>(
    activeFilters as Array<TextFilterKey>,
  );
  const [filterTexts, setFilterTexts] =
    useState<Partial<Record<TextFilterKey, string>>>(appliedFilters);

  const handleReset = () => {
    setFilterTexts({});
    setActiveFilterTypes([]);
    resetFilters();
  };

  const toggleFilterType = (key: TextFilterKey) => {
    setActiveFilterTypes((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
    );
  };

  const handleApply = () => {
    const updates = activeFilterTypes.reduce(
      (acc, key) => {
        acc[key] = filterTexts[key] ?? "";
        return acc;
      },
      {} as Record<string, string>,
    );
    updateFilters(updates);
  };

  return (
    <div className="flex flex-wrap gap-2 py-4 items-center justify-start">
      <Button
        type="button"
        className="flex items-center justify-center shadow-sm px-2 h-10 border rounded-md disabled:opacity-50"
        onClick={handleReset}
        disabled={isPending}
        title="Reset Filters"
      >
        <RotateCcwIcon className={cn("w-4 h-4", isPending && "animate-spin")} />
      </Button>

      {EVENT_TYPE_OPTIONS.map((event) => {
        return (
          <Button
            key={event.value}
            variant="outline"
            className={cn(
              "bg-inherit text-black transition-all",
              filters[event.key] === event.value &&
                "underline underline-offset-4 bg-primary/20 border-primary",
            )}
            disabled={isPending}
            onClick={() => {
              if (filters.eventType === event.key) {
                updateFilters({ [event.key]: undefined });
              } else updateFilters({ [event.key]: event.value });
            }}
          >
            {event.label}
          </Button>
        );
      })}
      <div className="flex flex-wrap gap-2 items-center w-full">
        <span className="text-sm text-gray-500">Search by:</span>
        {TEXT_FILTER_OPTIONS.map(({ label, value }) => {
          const isSelected = activeFilterTypes.includes(value);
          return (
            <button
              key={value}
              type="button"
              onClick={() => toggleFilterType(value)}
              disabled={isPending}
              className={cn(
                "px-3 py-1.5 text-sm border rounded-md transition-all shadow-sm",
                isSelected
                  ? "bg-primary/20 border-primary underline underline-offset-4 text-black"
                  : "bg-inherit text-black hover:bg-gray-100",
              )}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Text inputs for each selected filter type */}
      {activeFilterTypes.length > 0 && (
        <div className="flex flex-col gap-2 w-full">
          {activeFilterTypes.map((key) => (
            <div key={key} className="flex items-center px-2 gap-2">
              <span className="text-sm text-gray-600 capitalize w-24 shrink-0">
                {key}:
              </span>
              <input
                type="text"
                value={filterTexts[key] ?? ""}
                onChange={(e) =>
                  setFilterTexts((prev) => ({ ...prev, [key]: e.target.value }))
                }
                placeholder={`Filter by ${key}...`}
                className="p-2 flex-1 border shadow-sm rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => {
                  setActiveFilterTypes((prev) => prev.filter((k) => k !== key));
                  setFilterTexts((prev) => ({ ...prev, [key]: "" }));
                  updateFilters({ [key]: "" });
                }}
                title={`Clear ${key} filter`}
              >
                &#10005;
              </Button>
            </div>
          ))}

          <div className="flex gap-2 px-2">
            <Button onClick={handleApply} disabled={isPending}>
              {isPending ? (
                <Loader2Icon className="w-4 h-4 animate-spin" />
              ) : (
                "Apply"
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

const EventFilter = () => {
  return (
    <Suspense
      fallback={
        <div className="flex gap-2 py-4 items-center animate-pulse">
          <div className="w-10 h-10 bg-gray-200 rounded-md" />
          <div className="w-24 h-10 bg-gray-200 rounded-md" />
          <div className="w-24 h-10 bg-gray-200 rounded-md" />
          <div className="w-40 h-10 bg-gray-200 rounded-md" />
        </div>
      }
    >
      <EventFilterInner />
    </Suspense>
  );
};

export default EventFilter;
