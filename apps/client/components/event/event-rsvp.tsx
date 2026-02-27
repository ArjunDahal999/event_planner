import { rsvpService } from "@/services/rsvp.service";
import { useQuery } from "@tanstack/react-query";
import EventResponseForm from "./event-response-form";
import QUERY_KEY_CONSTANT from "@/constant/query-key-constant";
import LockCover from "../lock-cover";

const EventRsvpResponse = ({ id }: { id: number }) => {
  const accessToken = localStorage.getItem("accessToken");
  const { data: rsvpResponse, isLoading: isRsvpLoading } = useQuery({
    queryKey: [QUERY_KEY_CONSTANT.RSVP, id],
    queryFn: () => rsvpService().getRsvp({ eventId: Number(id) }),
    enabled: Boolean(id && accessToken),
  });
  return (
    <div className="flex flex-wrap relative items-center gap-6 w-full text-muted-foreground text-sm">
      <LockCover />
      {!isRsvpLoading && rsvpResponse?.data && (
        <div className="bg-green-400/40 rounded-lg shadow-md p-6  w-full mx-auto">
          <h2 className="text-2xl font-semibold mb-4">
            {rsvpResponse?.data
              ? `Your response: ${rsvpResponse.data.response}`
              : "Are you attending the event?"}
          </h2>
          <p className="text-muted-foreground mb-4">
            You Have Submitted your response in{" "}
            <span className="font-medium">
              {rsvpResponse?.data?.createdAt
                ? new Date(rsvpResponse.data!.createdAt).toUTCString()
                : "N/A"}
            </span>
          </p>
        </div>
      )}
      {!isRsvpLoading && !rsvpResponse?.data && (
        <EventResponseForm eventId={id} />
      )}
    </div>
  );
};

export default EventRsvpResponse;
