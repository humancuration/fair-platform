import { json, type LoaderFunctionArgs, type ActionFunctionArgs } from "@remix-run/node";
import { useLoaderData, useActionData, Form } from "@remix-run/react";
import { getMinsiteById, updateMinsite, publishMinsite } from "~/models/minsite.server";
import { requireUserId } from "~/utils/session.server";
import { MinsiteBuilder } from "~/components/minsite/MinsiteBuilder";
import { useState } from "react";

export async function loader({ params, request }: LoaderFunctionArgs) {
  const userId = await requireUserId(request);
  const minsite = await getMinsiteById(params.id);
  
  if (!minsite) {
    throw new Response("Not Found", { status: 404 });
  }

  if (minsite.userId !== userId) {
    throw new Response("Unauthorized", { status: 401 });
  }

  return json({ minsite });
}

export async function action({ request, params }: ActionFunctionArgs) {
  const userId = await requireUserId(request);
  const formData = await request.formData();
  const intent = formData.get("intent");

  if (intent === "save") {
    const data = {
      title: formData.get("title"),
      content: formData.get("content"),
      template: formData.get("template"),
      customCSS: formData.get("customCSS"),
      seoMetadata: JSON.parse(formData.get("seoMetadata") as string),
      components: JSON.parse(formData.get("components") as string),
      settings: JSON.parse(formData.get("settings") as string),
    };

    const minsite = await updateMinsite(params.id, data);
    return json({ success: true, minsite });
  }

  if (intent === "publish") {
    const minsite = await publishMinsite(params.id);
    return json({ success: true, minsite });
  }

  return json({ success: false, error: "Invalid intent" }, { status: 400 });
}

export default function MinsiteRoute() {
  const { minsite } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  
  return (
    <MinsiteBuilder 
      initialData={minsite}
      actionData={actionData}
    />
  );
}
