/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { CreateEventDTO, createEventSchema } from "@event-planner/shared";
import { Button } from "../ui/button";

type EventFormValues = {
  title: string;
  description: string;
  location: string;
  event_date: string;
  event_type: "public" | "private";
  tags: string;
};

interface EventFormProps {
  initialData?: CreateEventDTO;
  onSubmit: (data: CreateEventDTO) => void;
  mode: "create" | "update";
}

const inputStyles =
  "w-full  border border-gray-300 bg-white px-4 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition";

const labelStyles = "text-sm font-medium text-gray-700";

const errorStyles = "text-xs text-red-500 mt-1";

const EventForm = (props: EventFormProps) => {
  const form = useForm<EventFormValues, unknown, CreateEventDTO>({
    //@ts-ignore
    resolver: zodResolver(createEventSchema),
    defaultValues: {
      description: props.initialData?.description ?? "",
      location: props.initialData?.location ?? "",
      title: props.initialData?.title ?? "",
      event_date: props.initialData?.event_date
        ? new Date(props.initialData.event_date).toISOString().slice(0, 16)
        : "",
      event_type: props.initialData?.event_type ?? "public",
      tags: props.initialData?.tags.join(", ") ?? "",
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form;

  return (
    <>
      <div className="max-w-3xl shadow-sm mx-auto bg-white   border p-8">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">
          {props.mode === "create" ? "Create New Event" : "Update Event"}
        </h2>

        <form onSubmit={handleSubmit(props.onSubmit)} className="space-y-6">
          {/* ___title____ */}
          <div>
            <label className={labelStyles}>Title</label>
            <input
              {...register("title")}
              className={inputStyles}
              placeholder="Enter event title"
            />
            {errors.title && (
              <p className={errorStyles}>{errors.title.message}</p>
            )}
          </div>
          {/* ___description____ */}
          <div>
            <label className={labelStyles}>Description</label>
            <textarea
              {...register("description")}
              rows={4}
              className={inputStyles}
              placeholder="Describe your event"
            />
            {errors.description && (
              <p className={errorStyles}>{errors.description.message}</p>
            )}
          </div>

          {/* ___event_date & location____ */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className={labelStyles}>Event Date</label>
              <input
                {...register("event_date")}
                type="datetime-local"
                className={inputStyles}
              />
              {errors.event_date && (
                <p className={errorStyles}>{errors.event_date.message}</p>
              )}
            </div>
            <div>
              <label className={labelStyles}>Location</label>
              <input
                {...register("location")}
                className={inputStyles}
                placeholder="Event location"
              />
              {errors.location && (
                <p className={errorStyles}>{errors.location.message}</p>
              )}
            </div>
          </div>

          {/* ___event_type____ */}
          <div>
            <label className={labelStyles}>Event Type</label>
            <select {...register("event_type")} className={inputStyles}>
              <option value="public"> Public</option>
              <option value="private"> Private</option>
            </select>
          </div>
          {/* ___tags____ */}
          <div>
            <label className={labelStyles}>Tags</label>
            <input
              {...register("tags")}
              className={inputStyles}
              placeholder="e.g. tech, meetup, networking"
            />
            <p className="text-xs text-gray-500 mt-1">
              Separate tags with commas
            </p>
          </div>

          <div className="pt-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full  text-white font-medium py-3 rounded-lg shadow-md hover:shadow-none transition disabled:opacity-50"
            >
              {isSubmitting
                ? "Processing..."
                : props.mode === "create"
                  ? "Create Event"
                  : "Update Event"}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default EventForm;
