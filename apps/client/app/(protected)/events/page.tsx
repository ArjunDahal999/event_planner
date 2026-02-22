"use client";

import React, { useEffect, useState } from "react";
import { eventService } from "@/services/event.service";

const EventsPage: React.FC = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    eventService()
      .getEvents()
      .then((data) => {
        if (mounted) setEvents(data);
      })
      .catch((err) => {
        if (mounted) setError(err?.message || String(err));
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <pre>{JSON.stringify(events, null, 2)}</pre>
    </div>
  );
};

export default EventsPage;
