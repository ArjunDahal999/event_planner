import QUERY_KEY_CONSTANT from "@/constant/query-key-constant";
import { eventService } from "@/services/event.service";
import { IEvent } from "@event-planner/shared";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "../ui/button";
import { Dialog } from "../ui/dialog";
import { toast } from "sonner";

export const EventOptions = ({ event }: { event: IEvent }) => {
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: () => eventService().deleteEvent({ eventId: event.id }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY_CONSTANT.EVENTS],
      });
      toast.success("Event deleted successfully");
      router.push("/events");
    },
  });

  const currentUserId = localStorage.getItem("userId");
  if (currentUserId !== event?.userId?.toString()) {
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
