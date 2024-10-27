import { json, unstable_parseMultipartFormData, type ActionFunctionArgs } from "@remix-run/node";
import { requireUserId } from "~/utils/session.server";
import { uploadHandler } from "~/utils/uploads.server";
import { prisma } from "~/utils/db.server";

export async function action({ request }: ActionFunctionArgs) {
  const userId = await requireUserId(request);
  
  const formData = await unstable_parseMultipartFormData(request, uploadHandler);
  const file = formData.get("file");
  const minsiteId = formData.get("minsiteId");

  if (!file || typeof file !== "string") {
    return json({ error: "No file uploaded" }, { status: 400 });
  }

  const upload = await prisma.upload.create({
    data: {
      filename: file.split("/").pop() || "unnamed",
      path: file,
      contentType: formData.get("contentType") as string,
      size: Number(formData.get("size")),
      userId,
      minsiteId: minsiteId as string,
    }
  });

  return json({ success: true, upload });
}
