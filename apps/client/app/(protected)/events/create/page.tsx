"use client";
import EventForm from "@/components/event/event-form";
import { Button } from "@/components/ui/button";
import { eventService } from "@/services/event.service";
import { CreateEventDTO } from "@event-planner/shared";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { ViewTransition } from "react";
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

  const handleBack = () => {
    router.back();
  };

  return (
    <>
      <Button onClick={handleBack} className=" w-fit group">
        {" "}
        <ChevronLeft className=" group-hover:translate-x-2 transition-transform duration-500 " />{" "}
        Back
      </Button>
      <ViewTransition enter="slide-out" exit="slide-in" default={"none"}>
        <div className="flex gap-y-2 flex-col pt-3 ">
          <EventForm mode="create" onSubmit={handleCreateEvent} />
        </div>
      </ViewTransition>
    </>
  );
};

export default CreateEventPage;
