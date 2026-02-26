"use client";
import { EventCard } from "@/components/event/event-card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { IEvent } from "@event-planner/shared";
import Link from "next/link";

const LandingPage = () => {
  return (
    <div className=" min-h-screen relative bg-amber-200/20 flex items-center overflow-hidden justify-center  mx-auto">
      <Background />
      <div className="flex flex-col gap-4">
        <div className=" z-9 bg-white/10 p-4 shadow">
          <h1 className="text-7xl font-bold text-primary">Event Planner</h1>
          <p className="text-lg text-center">Plan your events with ease</p>
          <Link href="/events" className=" w-full">
            <Button className="w-full mx-auto">Get Started</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;

const Background = () => {
  return (
    <>
      <Dummy id={1} className="absolute top-20 rotate-0 " />
      <Dummy id={2} className="absolute top-20 rotate-6 -right-20 " />
      <Dummy id={3} className="absolute top-20 rotate-12 -right-40 " />
      <Dummy
        id={4}
        className="absolute bottom-20 -rotate-12 -translate-x-64 "
      />
      <Dummy id={5} className="absolute bottom-20 -rotate-6 -translate-x-32 " />
      <Dummy id={6} className="absolute bottom-20 -rotate-6 -translate-x-32" />
    </>
  );
};

const Dummy = ({ id, className }: { id: number; className?: string }) => {
  const event: IEvent = {
    id,
    title: "React Conf Nepal 2026",
    description: `
React Conf Nepal 2026 is the largest React-focused conference in South Asia,
bringing together developers, tech leaders, and UI/UX enthusiasts.

Join us for a full day of deep dives into React 19, Server Components,
Next.js advancements, performance optimization, scalable architecture,
and modern frontend best practices. The event includes keynote sessions,
hands-on workshops, networking opportunities, and startup showcases.

Whether you're a junior developer or a senior engineer, this conference
will help you level up your React and full-stack development skills.
  `,
    eventDate: "2026-04-18T09:00:00+05:45",
    location: "Hyatt Regency, Kathmandu, Nepal",
    eventType: "public",
    userName: "Arjun Dahal",
    createdAt: "2026-02-20T14:30:00+05:45",
    userId: 7,
    tags: [
      {
        tagName: "React",
        tagColor: "#61DBFB",
      },
      {
        tagName: "Next.js",
        tagColor: "#000000",
      },
      {
        tagName: "Frontend",
        tagColor: "#38BDF8",
      },
      {
        tagName: "Workshop",
        tagColor: "#10B981",
      },
    ],
    rsvpSummary: [
      {
        response: "YES",
        count: 342,
      },
      {
        response: "NO",
        count: 18,
      },
      {
        response: "MAYBE",
        count: 76,
      },
    ],
  };
  return (
    <EventCard.Root
      className={cn(
        "max-w-lg -rotate-15 shadow-none top-0 select-none p-4 absolute opacity-5  hover:z-[9] hover:opacity-15 hover:scale-105 transition-all duration-300  h-fit",
        className,
      )}
      event={event}
    >
      <EventCard.Header />
      <EventCard.Description />
      <EventCard.Date />
      <EventCard.Location />
      <EventCard.Type />
      <EventCard.CreatedBy />
      <EventCard.Tags />
      <EventCard.RsvpSummary />
    </EventCard.Root>
  );
};
