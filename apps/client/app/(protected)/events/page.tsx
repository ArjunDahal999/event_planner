"use client";
import { ViewTransition } from "react";
import { eventService } from "@/services/event.service";
import { useQuery } from "@tanstack/react-query";
import { EventCard } from "@/components/event/event-card";
import { useEventFilters } from "@/components/event/use-filter.hook";
import { EventCardSkeleton } from "@/components/event/event-loading-skeletion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import QUERY_KEY_CONSTANT from "@/constant/query-key-constant";
import EventFilter from "@/components/event/event-filter";
import Pagination from "@/components/event/event-pagination";

const EventsPage = () => {
  const { filters, updateFilters } = useEventFilters();
  const {
    data: eventsResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: [QUERY_KEY_CONSTANT.EVENTS, filters],
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
    <ViewTransition enter={"slide-out"} exit={"slide-in"} default={"none"}>
      <section className=" relative pb-32 md:pb-16 p-8 ">
        <div>
          <Link href="/events/create">
            <Button>Create Event</Button>
          </Link>
        </div>
        <EventFilter />

        <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4  place-items-center ">
          {isLoading &&
            [...Array(6)].map((_, index) => <EventCardSkeleton key={index} />)}
          {!isLoading && eventsResponse?.events.length === 0 && (
            <div className="col-span-full text-center text-gray-500">
              No events found. Try adjusting your filters.
            </div>
          )}
          {eventsResponse?.events.map((event) => (
            <ViewTransition key={event.id}>
              <Link href={`/events/${event.id}`} className="h-fit">
                <EventCard.Root className=" w-80 md:w-sm p-4" event={event}>
                  <EventCard.Header />
                  <EventCard.Description />
                  <EventCard.Date />
                  <EventCard.Location />
                  <EventCard.Type />
                  <EventCard.CreatedBy />
                  <EventCard.Tags />
                  <EventCard.RsvpSummary />
                </EventCard.Root>
              </Link>
            </ViewTransition>
          ))}
        </div>
        <Pagination
          page={filters.page || 1}
          total={eventsResponse?.meta.totalCount || 0}
          limit={filters.limit || 6}
          updateFilters={updateFilters}
        />
      </section>
    </ViewTransition>
  );
};

export default EventsPage;
