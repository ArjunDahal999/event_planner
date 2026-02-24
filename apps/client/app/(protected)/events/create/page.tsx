"use client";
import EventForm from "@/components/event/event-form";
import { Button } from "@/components/ui/button";
import { eventService } from "@/services/event.service";
import { CreateEventDTO } from "@event-planner/shared";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";

const CreateEventPage = () => {
  const router = useRouter();
  const handleCreateEvent = async (data: CreateEventDTO) => {
    try {
      const res = await eventService().createEvent({ payload: data });
      toast.success(res.message);
      router.push("/events");
    } catch (error) {
      console.error("Error creating event:", error);
    }
  };
  return (
    <div className="flex gap-y-2 flex-col ">
      <Link href="/events">
        <Button className=" w-fit group">
          {" "}
          <ChevronLeft className=" group-hover:translate-x-2 transition-transform duration-500 " />{" "}
          Back
        </Button>
      </Link>
      <EventForm mode="create" onSubmit={handleCreateEvent} />
    </div>
  );
};

export default CreateEventPage;
