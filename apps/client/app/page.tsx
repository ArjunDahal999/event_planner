"use client";
import { Background } from "@/components/landing/event-background";
import { Button } from "@/components/ui/button";
import { eventService } from "@/services/event.service";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

const LandingPage = () => {
  const { data } = useQuery({
    queryKey: ["landingPageData"],
    queryFn: () => eventService().getEventsForLandingPage(),
  });

  return (
    <div className=" min-h-screen relative bg-amber-200/20 flex items-center overflow-hidden justify-center  mx-auto">
      <Background events={data?.data?.events ?? []} />
      <div className="flex flex-col gap-4 mx-auto ">
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
