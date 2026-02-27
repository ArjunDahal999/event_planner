"use client";
import EventForm from "@/components/event/event-form";
import LockCover from "@/components/lock-cover";
import { Button } from "@/components/ui/button";
import QUERY_KEY_CONSTANT from "@/constant/query-key-constant";
import { eventService } from "@/services/event.service";
import { CreateEventDTO } from "@event-planner/shared";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ViewTransition } from "react";
import { toast } from "sonner";

const CreateEventPage = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: async (data: CreateEventDTO) => {
      const res = await eventService().createEvent({ payload: data });
      return res;
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY_CONSTANT.EVENTS] });
      toast.success(res.message);
      router.push("/events");
    },
    onError: (error) => {
      console.error("Error creating event:", error);
    },
  });

  return (
    <div className=" pt-8">
      <Link href={"/events"}>
        <Button className=" w-fit group">
          <ChevronLeft className=" group-hover:translate-x-2 transition-transform duration-500 " />{" "}
          Back
        </Button>
      </Link>
      <ViewTransition enter="slide-out" exit="slide-in" default={"none"}>
        <div className="flex gap-y-2 relative flex-col pt-3 w-fit mx-auto ">
          <LockCover />
          <EventForm mode="create" onSubmit={mutate} />
        </div>
      </ViewTransition>
    </div>
  );
};

export default CreateEventPage;
