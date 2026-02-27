"use client";
import { cn } from "@/lib/utils";
import { EventCard } from "../event/event-card";
import { IEvent } from "@event-planner/shared";
import Link from "next/link";

const POSITIONS = [
  "top-[5%] left-[0%] rotate-[-12deg] scale-90",
  "top-[10%] left-[55%] rotate-[8deg] scale-100",
  "top-[40%] left-[15%] rotate-[-6deg] scale-110",
  "top-[0%] left-[80%] rotate-[14deg] scale-95",
  "top-[70%] left-[30%] rotate-[-10deg] scale-100",
  "top-[75%] left-[65%] rotate-[6deg] scale-95",
];

export const Background = ({ events }: { events: IEvent[] }) => {
  return (
    <div className="absolute  w-full h-screen overflow-hidden">
      {events.slice(0, 6).map((event, index) => (
        <Dummy key={event.id} event={event} className={POSITIONS[index % 6]} />
      ))}
    </div>
  );
};

const Dummy = ({ event, className }: { event: IEvent; className?: string }) => {
  return (
    <Link
      className={cn(
        "absolute w-md p-4 h-fit opacity-15 select-none shadow-none transition-all duration-300 hover:opacity-55 hover:scale-105 hover:z-10",
        className,
      )}
      href={`/events/${event.id}`}
    >
      <EventCard.Root event={event}>
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
  );
};
