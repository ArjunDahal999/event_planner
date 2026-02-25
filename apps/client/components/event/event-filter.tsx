"use client";

import { cn } from "@/lib/utils";
import { RotateCcwIcon, Loader2Icon } from "lucide-react";
import { Button } from "../ui/button";
import { useEventFilters } from "./use-filter.hook";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";

// 1. The actual filter logic component
const EventFilterInner = () => {
  const searchParams = useSearchParams();
  const tags = searchParams.get("tags") ?? "";

  const { filters, updateFilters, isPending, resetFilters } = useEventFilters();
  const [tagFilter, setTagFilter] = useState<string>(tags);

  // Sync local state with URL params if they change externally (like on Reset)
  useEffect(() => {
    setTagFilter(tags);
  }, [tags]);

  const handleReset = () => {
    setTagFilter("");
    resetFilters();
  };

  return (
    <div className="flex flex-wrap gap-2 gap-x-2 py-4 items-center">
      <button
        type="button"
        className="flex items-center justify-center shadow-sm px-2 h-10 border rounded-md hover:bg-gray-50 disabled:opacity-50"
        onClick={handleReset}
        disabled={isPending}
        title="Reset Filters"
      >
        <RotateCcwIcon className={cn("w-4 h-4", isPending && "animate-spin")} />
      </button>

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

      <div className="flex items-center gap-2">
        <input
          type="text"
          value={tagFilter}
          onChange={(e) => setTagFilter(e.target.value)}
          placeholder="node,python,react"
          className="p-[0.5rem] border shadow-sm rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
        />
        <Button
          onClick={() => updateFilters({ tags: tagFilter })}
          disabled={
            isPending ||
            tagFilter === (filters.tags || "") ||
            (tagFilter.length === 0 && !filters.tags)
          }
        >
          {isPending ? (
            <Loader2Icon className="w-4 h-4 animate-spin" />
          ) : (
            "Apply"
          )}
        </Button>
      </div>
    </div>
  );
};

// 2. The exported component wrapped in Suspense to fix the Build Error
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
