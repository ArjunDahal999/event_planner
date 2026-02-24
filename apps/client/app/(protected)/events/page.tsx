"use client";

import { eventService } from "@/services/event.service";
import { useQuery } from "@tanstack/react-query";
import { EventCard } from "@/components/event/event-card";
import { useEventFilters } from "@/components/event/use-filter.hook";
import { EventCardSkeleton } from "@/components/event/event-loading-skeletion";
import { Button } from "@/components/ui/button";
import { RotateCcwIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useDeferredValue, ViewTransition } from "react";

const EventsPage = () => {
  const { filters, updateFilters, isPending, resetFilters } = useEventFilters();
  const {
    data: eventsResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["events", filters],
    queryFn: async () => {
      const response = await eventService().getEvents({ filters });
      return response.data;
    },
    placeholderData: (prev) => prev,
  });

  if (error)
    return (
      <div>
        Error: {error instanceof Error ? error.message : "Unknown error"}
      </div>
    );

  return (
    <section className=" ">
      <div>
        <Link href="/events/create">
          <Button>Create Event</Button>
        </Link>
      </div>

      <div className=" flex gap-x-2 py-4">
        <button
          className=" flex items-center justify-center shadow-sm px-2"
          onClick={resetFilters}
          disabled={isPending}
        >
          <RotateCcwIcon />
        </button>
        <Button
          className={cn(
            " bg-inherit text-black",
            filters.eventType === "public" &&
              "underline underline-offset-4 bg-primary/40",
          )}
          onClick={() => updateFilters({ eventType: "public" })}
        >
          Public Events
        </Button>
        <Button
          className={cn(
            " bg-inherit text-black",
            filters.eventType === "private" &&
              "underline underline-offset-4 bg-primary/40",
          )}
          onClick={() => updateFilters({ eventType: "private" })}
        >
          Private Events
        </Button>
        <select className=" shadow-sm">
          <option value="date_desc">Date Descending</option>
          <option value="date_asc">Date Ascending</option>
          <option value="createdAt_desc">Created At Descending</option>
          <option value="createdAt_asc">Created At Ascending</option>
        </select>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 p-4 transition-main-grid">
        {isLoading &&
          [...Array(6)].map((_, index) => <EventCardSkeleton key={index} />)}
        {eventsResponse?.events.map((event) => (
          <EventCard.Root
            className=" max-w-sm p-4"
            key={event.id}
            event={event}
          >
            <EventCard.Header />
            <EventCard.Description />
            <EventCard.Date />
            <EventCard.Location />
            <EventCard.Type />
            <EventCard.CreatedBy />
            <EventCard.Tags />
            <EventCard.Options />
          </EventCard.Root>
        ))}
      </div>
    </section>
  );
};

export default EventsPage;
