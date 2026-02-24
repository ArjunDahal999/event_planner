"use client";

import EventForm from "@/components/event/event-form";
import { Button } from "@/components/ui/button";
import { eventService } from "@/services/event.service";
import { CreateEventDTO } from "@event-planner/shared";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { ViewTransition } from "react";

const EventUpdatePage = () => {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const {
    data: eventResponse,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["event", params.id],
    queryFn: () =>
      eventService().getEventById({ eventId: parseInt(params.id) }),
    enabled: !!params.id,
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError || !eventResponse) return <div>Error loading event.</div>;
  const event = eventResponse.data;

  const handleBack = () => {
    router.back();
  };

  const handleUpdateEvent = async (data: CreateEventDTO) => {
    try {
      // Call the updateEvent function from the event service
      await eventService().updateEvent({
        eventId: event.id,
        payload: {
          description: data.description,
          event_date: data.event_date,
          event_type: data.event_type,
          location: data.location,
          tags: data.tags,
          title: data.title,
        },
      });
      // After successful update, navigate back to the event details page or show a success message
      router.push(`/events/${event.id}`);
    } catch (error) {
      console.error("Error updating event:", error);
    }
  };
  return (
    <>
      <Button onClick={handleBack} className="w-fit group mb-3">
        <ChevronLeft className="group-hover:translate-x-2 transition-transform duration-500" />
        Back
      </Button>
      <ViewTransition enter="slide-out" exit="slide-in" default={"none"}>
        <div className="flex gap-y-2 flex-col pt-3">
          <EventForm
            initialData={{
              ...event,
              event_type: event.eventType === "public" ? "public" : "private",
              tags: event.tags.map((tag) => tag.tagName),
              event_date: event.eventDate
                ? new Date(event.eventDate)
                : undefined,
            }}
            mode="update"
            onSubmit={handleUpdateEvent}
          />
        </div>
      </ViewTransition>
    </>
  );
};

export default EventUpdatePage;
