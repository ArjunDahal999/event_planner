import { IEvent } from "@event-planner/shared";
import { createContext, useContext, ReactNode, ViewTransition } from "react";
import { hexToRgba } from "@/utils/hex-to-rgb";
import { GlobeIcon, UserKeyIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import Image from "next/image";

type EventCardRootProps = React.ComponentProps<typeof EventCardRoot>;
type EventCardHeaderProps = React.ComponentProps<typeof EventHeader>;
type EventCardDescriptionProps = React.ComponentProps<typeof EventDescription>;
type EventCardDateProps = React.ComponentProps<typeof EventDate>;
type EventCardLocationProps = React.ComponentProps<typeof EventLocation>;
type EventCardTypeProps = React.ComponentProps<typeof EventType>;
type EventCardTagsProps = React.ComponentProps<typeof EventTags>;
type EventCardCreatedByProps = React.ComponentProps<typeof EventCreatedBy>;
type EventCardOptionsProps = React.ComponentProps<typeof EventOptions>;
type EventCardRsvpSummaryProps = React.ComponentProps<typeof EventRsvpSummary>;

interface EventCardComponent {
  Root: React.ComponentType<EventCardRootProps>;
  Header: React.ComponentType<EventCardHeaderProps>;
  Description: React.ComponentType<EventCardDescriptionProps>;
  Date: React.ComponentType<EventCardDateProps>;
  Location: React.ComponentType<EventCardLocationProps>;
  Type: React.ComponentType<EventCardTypeProps>;
  Tags: React.ComponentType<EventCardTagsProps>;
  CreatedBy: React.ComponentType<EventCardCreatedByProps>;
  Options: React.ComponentType<EventCardOptionsProps>;
  RsvpSummary: React.ComponentType<EventCardRsvpSummaryProps>;
}

const EventContext = createContext<IEvent | null>(null);

const useEventContext = (): IEvent => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error("useEventContext must be used within an EventProvider");
  }
  return context;
};

const EventCardRoot = ({
  children,
  event,
  className,
}: {
  children: ReactNode;
  event: IEvent;
  className?: string;
}) => (
  <EventContext.Provider value={event}>
    <ViewTransition name={`event-${event.id}`}>
      <div
        style={{ viewTransitionName: `event-${event.id}` }}
        className={cn(
          `flex flex-col h-full p-4  group  bg-white  hover:shadow-lg  duration-300
          gap-6 rounded-xl border py-6 shadow-sm
        `,
          className,
        )}
      >
        {children}
      </div>
    </ViewTransition>
  </EventContext.Provider>
);

const EventHeader = () => {
  const { id, title } = useEventContext();
  return (
    <ViewTransition name={`event-title-${id}`}>
      <h3
        className="font-bold cursor-pointer group-hover:text-primary text-black hover:text-primary hover:underline 
    text-center h-12 flex items-center line-clamp-1 "
      >
        {title}
      </h3>
    </ViewTransition>
  );
};

const EventDescription = () => {
  const { id, description } = useEventContext();
  return (
    <ViewTransition name={`event-description-${id}`}>
      <p className="text-sm h-20 overflow-hidden  line-clamp-4 text-start ">
        {description}
      </p>
    </ViewTransition>
  );
};

const EventDate = () => {
  const { id, eventDate } = useEventContext();
  return (
    <ViewTransition name={`event-date-${id}`}>
      <p className="h-6 flex items-center text-sm">
        Date :
        <span className="font-bold ml-1">
          {new Date(eventDate).toLocaleDateString()}
        </span>
      </p>
    </ViewTransition>
  );
};

const EventLocation = () => {
  const { id, location } = useEventContext();
  return (
    <ViewTransition name={`event-location-${id}`}>
      <p className="h-6 flex items-center text-sm  truncate">
        <span className="font-medium mr-1">Location:</span>
        <span className="font-bold">{location} </span>
      </p>
    </ViewTransition>
  );
};

const EventType = () => {
  const { id, eventType } = useEventContext();
  return (
    <ViewTransition name={`event-type-${id}`}>
      {eventType === "public" ? (
        <div className="h-6 text-green-600 font-semibold flex items-center gap-1 text-sm">
          <GlobeIcon className="w-4 h-4" /> Public
        </div>
      ) : (
        <div className="h-6 text-red-600 font-semibold flex items-center gap-1 text-sm">
          <UserKeyIcon className="w-4 h-4" /> Private
        </div>
      )}
    </ViewTransition>
  );
};

const EventCreatedBy = () => {
  const { id, userName } = useEventContext();
  return (
    <ViewTransition name={`event-createdBy-${id}`}>
      <p className="h-6 flex items-center capitalize text-sm text-muted-foreground">
        Created by :<span className="font-bold ml-1">{userName}</span>
      </p>
    </ViewTransition>
  );
};

const EventOptions = () => {
  const userId = localStorage.getItem("userId");
  const { userId: eventCreatorId } = useEventContext();
  if (userId !== eventCreatorId.toString()) {
    return null;
  }
  return (
    <div className="h-6 flex items-center gap-2">
      <Button variant="outline" size="sm">
        Edit
      </Button>
      <Button variant="outline" size="sm" className="text-red-600">
        Delete
      </Button>
    </div>
  );
};

export const EventRsvpSummary = () => {
  const { id, rsvpSummary } = useEventContext();
  const rsvpMap: Record<string, number> = {
    YES: 0,
    NO: 0,
    "MAY BE": 0,
  };
  rsvpSummary.forEach((rsvp) => {
    rsvpMap[rsvp.response] = rsvp.count;
  });
  return (
    <ViewTransition name={`event-rsvpSummary-${id}`}>
      <div className="h-16  flex flex-wrap overflow-y-auto content-start gap-2">
        <div className="flex items-center gap-1 text-green-600">
          <Image alt="" src={"/fire.png"} width={60} height={60} />
          <span className=" text-3xl font-bold text-orange-400">
            {rsvpMap["YES"]}
            <span className="text-sm font-bold"> Participants</span>
          </span>
        </div>
      </div>
    </ViewTransition>
  );
};
const EventTags = () => {
  const { id, tags } = useEventContext();
  return (
    <ViewTransition name={`event-tags-${id}`}>
      <div className="h-22  flex flex-wrap overflow-y-auto content-start gap-2">
        {tags.map((tag, index) => (
          <Button
            key={`${tag.tagName}-${index}`}
            className="inline-block px-2 py-1 capitalize text-black text-xs"
            style={{ backgroundColor: hexToRgba(tag.tagColor, 0.4) }}
          >
            {tag.tagName}
          </Button>
        ))}
      </div>
    </ViewTransition>
  );
};

export const EventCard: EventCardComponent = {
  Root: EventCardRoot,
  Header: EventHeader,
  Description: EventDescription,
  Date: EventDate,
  Location: EventLocation,
  Type: EventType,
  Tags: EventTags,
  CreatedBy: EventCreatedBy,
  Options: EventOptions,
  RsvpSummary: EventRsvpSummary,
};
