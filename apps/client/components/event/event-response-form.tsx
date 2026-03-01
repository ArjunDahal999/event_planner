import { CircleCheck, CircleQuestionMarkIcon, CircleXIcon } from "lucide-react";
import { useState } from "react";
import { Dialog } from "../ui/dialog";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { rsvpService } from "@/services/rsvp.service";
import { toast } from "sonner";
import QUERY_KEY_CONSTANT from "@/constant/query-key-constant";

const EventResponseForm = ({ eventId }: { eventId: number }) => {
  const responses = [
    {
      id: 1,
      label: "YES",
      icon: CircleCheck,
      color: "bg-green-400 hover:bg-green-500",
    },
    {
      id: 2,
      label: "NO",
      icon: CircleXIcon,
      color: "bg-red-500 hover:bg-red-600",
    },
    {
      id: 3,
      label: "MAY BE",
      icon: CircleQuestionMarkIcon,
      color: "bg-yellow-400 hover:bg-yellow-500",
    },
  ];

  const [selectedResponse, setSelectedResponse] = useState<number | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: async (responseId: number) => {
      const res = await rsvpService().submitResponse({
        eventId,
        response: responses.find((response) => response.id === responseId)
          ?.label as "YES" | "NO" | "MAY BE",
      });
      return res;
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY_CONSTANT.RSVP, eventId],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY_CONSTANT.EVENTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY_CONSTANT.EVENT, eventId.toString()],
      });
      toast.success(res.message);
    },
  });

  return (
    <div className=" w-full">
      <div className="bg-slate-400/10 rounded-lg shadow-md p-6 w-full mx-auto">
        <h2 className="text-2xl font-semibold mb-4">
          Are you attending the event?
        </h2>

        <div className=" flex items-center justify-evenly gap-x-2">
          {responses.map((response) => (
            <button
              onClick={() => {
                setSelectedResponse(response.id);
                setIsDialogOpen(true);
              }}
              key={response.id}
              className={`transition-all duration-300 size-20 ease-in-out md:size-80 ${response.color} flex items-center justify-center shadow-md hover:shadow-none`}
            >
              <response.icon size={200} className="text-white" />
            </button>
          ))}
        </div>
      </div>
      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
        <div className="bg-white rounded-lg  p-6 w-full max-w-md mx-auto">
          <h2 className="text-2xl font-semibold mb-4">Confirm Your Response</h2>
        </div>
        <div className="bg-white rounded-lg p-6 w-full max-w-md mx-auto">
          <p className="text-gray-700 mb-4">
            Do you want to submit your response as{" "}
          </p>
          <div className="flex justify-end gap-x-4">
            <Button
              disabled={isPending}
              onClick={() => setIsDialogOpen(false)}
              className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-400 transition-colors duration-300"
            >
              Cancel
            </Button>
            <Button
              disabled={isPending}
              onClick={() => {
                setIsDialogOpen(false);
                if (selectedResponse !== null) {
                  mutate(selectedResponse);
                }
              }}
              className={cn(
                "px-4 py-2 rounded text-white transition-colors duration-300",
                responses.find((response) => response.id === selectedResponse)
                  ?.color || "bg-blue-500",
              )}
            >
              {
                responses.find((response) => response.id === selectedResponse)
                  ?.label
              }
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default EventResponseForm;
