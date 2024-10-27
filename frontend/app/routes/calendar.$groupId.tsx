import type { LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, useSubmit, useRouteError } from "@remix-run/react";
import type { Event } from "~/types/calendar";
import { Calendar } from "~/components/calendar/Calendar";

export async function loader({ params }: LoaderFunctionArgs) {
  const { groupId } = params;
  
  // Fetch events from your backend
  const events = await getEvents(groupId);
  
  return json({ events });
}

export async function action({ request, params }: ActionFunctionArgs) {
  const { groupId } = params;
  const formData = await request.formData();
  const intent = formData.get("intent");

  switch (intent) {
    case "create":
      const eventData = JSON.parse(formData.get("eventData") as string);
      await createEvent(groupId, eventData);
      return json({ success: true });

    case "update":
      const updatedData = JSON.parse(formData.get("eventData") as string);
      await updateEvent(updatedData);
      return json({ success: true });

    case "delete":
      const eventId = formData.get("eventId");
      await deleteEvent(eventId);
      return json({ success: true });

    default:
      return json({ error: "Invalid intent" }, { status: 400 });
  }
}

export default function CalendarRoute() {
  const { events } = useLoaderData<typeof loader>();
  const submit = useSubmit();

  const handleCreateEvent = (eventData: Partial<Event>) => {
    const formData = new FormData();
    formData.append("intent", "create");
    formData.append("eventData", JSON.stringify(eventData));
    submit(formData, { method: "POST" });
  };

  return (
    <Calendar 
      events={events}
      onCreateEvent={handleCreateEvent}
      // ... other props
    />
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  
  return (
    <div className="p-4 bg-red-50 text-red-900">
      <h1>Error</h1>
      <p>{error instanceof Error ? error.message : "Unknown error occurred"}</p>
    </div>
  );
}
