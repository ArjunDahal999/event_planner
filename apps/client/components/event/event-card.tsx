import { IEvent } from "@event-planner/shared";
import { createContext, useContext, ReactNode } from "react";
import { hexToRgba } from "@/utils/hex-to-rgb";
import { GlobeIcon, UserKeyIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Button } from "../ui/button";

type EventCardRootProps = React.ComponentProps<typeof EventCardRoot>;
type EventCardHeaderProps = React.ComponentProps<typeof EventHeader>;
type EventCardDescriptionProps = React.ComponentProps<typeof EventDescription>;
type EventCardDateProps = React.ComponentProps<typeof EventDate>;
type EventCardLocationProps = React.ComponentProps<typeof EventLocation>;
type EventCardTypeProps = React.ComponentProps<typeof EventType>;
type EventCardTagsProps = React.ComponentProps<typeof EventTags>;
type EventCardCreatedByProps = React.ComponentProps<typeof EventCreatedBy>;
type EventCardOptionsProps = React.ComponentProps<typeof EventOptions>;

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
    <div
      className={cn(
        `flex flex-col h-full p-4  group   hover:shadow-lg  duration-300
        bg-primary/10   gap-6 rounded-xl border py-6 shadow-sm
        `,
        className,
      )}
    >
      {children}
    </div>
  </EventContext.Provider>
);

const EventHeader = () => {
  const { title } = useEventContext();
  return (
    <h3
      className="font-bold cursor-pointer text-black hover:text-primary hover:underline 
    text-center h-12 flex items-center line-clamp-1 "
    >
      {title}
    </h3>
  );
};

const EventDescription = () => {
  const { description } = useEventContext();
  return <p className="text-sm h-16  text-start ">{description}</p>;
};

const EventDate = () => {
  const { eventDate } = useEventContext();
  return (
    <p className="h-6 flex items-center text-sm">
      Date :
      <span className="font-bold ml-1">
        {new Date(eventDate).toLocaleDateString()}
      </span>
    </p>
  );
};

const EventLocation = () => {
  const { location } = useEventContext();
  return (
    <p className="h-6 flex items-center text-sm  truncate">
      <span className="font-medium mr-1">Location:</span>
      <span className="font-bold">{location} </span>
    </p>
  );
};

const EventType = () => {
  const { eventType } = useEventContext();
  return eventType === "public" ? (
    <div className="h-6 text-green-600 font-semibold flex items-center gap-1 text-sm">
      <GlobeIcon className="w-4 h-4" /> Public
    </div>
  ) : (
    <div className="h-6 text-red-600 font-semibold flex items-center gap-1 text-sm">
      <UserKeyIcon className="w-4 h-4" /> Private
    </div>
  );
};

const EventCreatedBy = () => {
  const { userName } = useEventContext();
  return (
    <p className="h-6 flex items-center capitalize text-sm text-muted-foreground">
      Created by :<span className="font-bold ml-1">{userName}</span>
    </p>
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

const EventTags = () => {
  const { tags } = useEventContext();
  return (
    <div
      style={{ viewTransitionName: "anything" }}
      className="h-22  flex flex-wrap overflow-y-auto content-start gap-2"
    >
      {tags.map((tag) => (
        <Link key={tag.tagName} href={"/events?tags=" + tag.tagName}>
          <Button
            className="inline-block px-2 py-1 capitalize text-black text-xs"
            style={{ backgroundColor: hexToRgba(tag.tagColor, 0.7) }}
            key={tag.tagName}
          >
            {tag.tagName}
          </Button>
        </Link>
      ))}
    </div>
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
};
