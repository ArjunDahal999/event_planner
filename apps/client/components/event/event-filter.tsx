"use client";

import { cn } from "@/lib/utils";
import { RotateCcwIcon, Loader2Icon } from "lucide-react";
import { Button } from "../ui/button";
import { useEventFilters } from "./use-filter.hook";
import { useState, Suspense } from "react";

const EventFilterInner = () => {
  const { filters, updateFilters, isPending, resetFilters } = useEventFilters();
  const [activeFilterType, setActiveFilterType] = useState<string>("");
  const [filterText, setFilterText] = useState<string>("");

  const handleReset = () => {
    setFilterText("");
    resetFilters();
  };

  return (
    <div className="flex flex-wrap gap-2 gap-x-2 py-4 items-center justify-center">
      <Button
        type="button"
        className="flex items-center justify-center shadow-sm px-2 h-10 border rounded-md disabled:opacity-50"
        onClick={handleReset}
        disabled={isPending}
        title="Reset Filters"
      >
        <RotateCcwIcon className={cn("w-4 h-4", isPending && "animate-spin")} />
      </Button>

      <Button
        variant="outline"
        className={cn(
          "bg-inherit text-black transition-all",
          filters.eventType === "public" &&
            "underline underline-offset-4 bg-primary/20 border-primary",
        )}
        disabled={isPending || filters.eventType === "public"}
        onClick={() => updateFilters({ eventType: "public" })}
      >
        Public Events
      </Button>

      <Button
        variant="outline"
        className={cn(
          "bg-inherit text-black transition-all",
          filters.eventType === "private" &&
            "underline underline-offset-4 bg-primary/20 border-primary",
        )}
        disabled={isPending || filters.eventType === "private"}
        onClick={() => updateFilters({ eventType: "private" })}
      >
        Private Events
      </Button>

      <Button
        variant="outline"
        className={cn(
          "bg-inherit text-black transition-all",
          filters.eventTimeLine === "past" &&
            "underline underline-offset-4 bg-primary/20 border-primary",
        )}
        disabled={isPending || filters.eventTimeLine === "past"}
        onClick={() => updateFilters({ eventTimeLine: "past" })}
      >
        Past Events
      </Button>
      <Button
        variant="outline"
        className={cn(
          "bg-inherit text-black transition-all",
          filters.eventTimeLine === "upcoming" &&
            "underline underline-offset-4 bg-primary/20 border-primary",
        )}
        disabled={isPending || filters.eventTimeLine === "upcoming"}
        onClick={() => updateFilters({ eventTimeLine: "upcoming" })}
      >
        Upcoming Events
      </Button>

      <select
        value={activeFilterType}
        onChange={(e) => {
          setActiveFilterType(e.target.value);
        }}
        className="p-[0.35rem] flex-1 md:flex-none border shadow-sm rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
      >
        <option value="">--</option>
        <option value="title">Title</option>
        <option value="description">Description</option>
        <option value="location">Location</option>
        <option value="tag">Tags</option>
      </select>

      {activeFilterType && (
        <div className="flex items-center px-2 w-full gap-2">
          <input
            type="text"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            placeholder={` ${activeFilterType} ...`}
            className="p-[0.5rem] flex-1 border shadow-sm rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
          />
          <Button
            onClick={() => {
              updateFilters({ [activeFilterType]: filterText });
            }}
            disabled={isPending}
          >
            {isPending ? (
              <Loader2Icon className="w-4 h-4 animate-spin" />
            ) : (
              "Apply"
            )}
          </Button>
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
