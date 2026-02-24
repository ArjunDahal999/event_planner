"use client";

import { eventService } from "@/services/event.service";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { useState, ViewTransition } from "react";
import { CalendarDays, ChevronLeft, MapPin, Tag, User } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { hexToRgba } from "@/utils/hex-to-rgb";
import { IEvent } from "@event-planner/shared";
import { Dialog } from "@/components/ui/dialog";
import { toast } from "sonner";

const Event = () => {
  const params = useParams<{ id: string }>();

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

  const event = eventResponse?.data;
  const router = useRouter();

  if (isLoading)
    return (
      <div className="max-w-4xl mx-auto p-8 animate-pulse space-y-6">
        <div className="h-10 w-1/2 bg-muted rounded" />
        <div className="h-6 w-1/3 bg-muted rounded" />
        <div className="h-40 bg-muted rounded-xl" />
      </div>
    );

  if (isError || !event)
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-semibold text-red-500">
          Error loading event.
        </h2>
      </div>
    );

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="max-w-7xl   px-6  space-y-10  flex flex-col gap-y-12">
      <Button className=" w-fit" onClick={handleBack}>
        <ChevronLeft /> Back
      </Button>
      <ViewTransition>
        <div className=" bg-primary/10  p-4 shadow-sm  rounded-lg space-y-8">
          <div className="space-y-4 p-6 rounded-xl">
            <ViewTransition name={`event-title-${event.id}`}>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                {event.title}
              </h1>
            </ViewTransition>

            <EventOptions event={event} />

            <div className="flex flex-wrap items-center gap-6 text-muted-foreground text-sm">
              <div className="flex items-center gap-2">
                <CalendarDays size={16} />
                {new Date(event.eventDate).toLocaleString()}
              </div>

              <div className="flex items-center gap-2">
                <MapPin size={16} />
                {event.location}
              </div>

              <div className="flex items-center gap-2 capitalize">
                <Tag size={16} />
                {event.eventType}
              </div>
            </div>
          </div>

          {/* Tags */}
          {event.tags?.length > 0 && (
            <ViewTransition name={`event-tags-${event.id}`}>
              <div className="flex flex-wrap gap-2 p-4">
                {event.tags.map((tag) => (
                  <Link
                    key={tag.tagName}
                    href={{ pathname: "/events", query: { tags: tag.tagName } }}
                  >
                    <Button
                      className="inline-block px-2 py-1 capitalize text-black text-xs"
                      style={{ backgroundColor: hexToRgba(tag.tagColor, 0.4) }}
                    >
                      {tag.tagName}
                    </Button>
                  </Link>
                ))}
              </div>
            </ViewTransition>
          )}

          <ViewTransition name={`event-description-${event.id}`}>
            <div className="bg-card border rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold mb-4">About this event</h2>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                {event.description}
              </p>
            </div>
          </ViewTransition>

          <ViewTransition name={`event-createdBy-${event.id}`}>
            <div className="flex items-center gap-4 bg-muted/40 p-4 rounded-xl">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <User size={18} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Organized by</p>
                <p className="font-medium capitalize">{event.userName}</p>
              </div>
            </div>
          </ViewTransition>
        </div>
      </ViewTransition>
    </div>
  );
};

export default Event;

const EventOptions = ({ event }: { event: IEvent }) => {
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const userId = localStorage.getItem("userId");

  const { mutate } = useMutation({
    mutationKey: ["deleteEvent", event.id],
    mutationFn: () => eventService().deleteEvent({ eventId: event.id }),
    onSuccess: () => {
      toast.success("Event deleted successfully");
      router.push("/events");
    },
  });

  if (userId !== event?.userId.toString()) {
    return null;
  }
  const handleDelete = () => {
    setIsDialogOpen(false);
    mutate();
  };
  return (
    <div className="h-6 flex items-center gap-2">
      <Link href={`/events/${event.id}/update`}>
        <Button variant="outline" size="sm">
          Edit
        </Button>
      </Link>

      <Button
        onClick={() => setIsDialogOpen(true)}
        variant="outline"
        size="sm"
        className="text-red-600"
      >
        Delete
      </Button>

      <Dialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        title="Confirm Deletion"
      >
        <p>Are you sure you want to delete this event?</p>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </Dialog>
    </div>
  );
};
