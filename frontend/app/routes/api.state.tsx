import { json, type ActionFunction } from "@remix-run/node";
import { getSession, commitSession } from "~/services/session.server";

export const action: ActionFunction = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));
  const formData = await request.formData();

  // Update session with form data
  for (const [key, value] of formData.entries()) {
    session.set(key, value);
  }

  return json(
    { success: true },
    {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    }
  );
};
