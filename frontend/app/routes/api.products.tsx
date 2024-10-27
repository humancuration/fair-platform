import { json, type ActionFunctionArgs } from "@remix-run/node";
import { requireUserId } from "~/utils/session.server";
import { prisma } from "~/utils/db.server";

export async function action({ request }: ActionFunctionArgs) {
  const userId = await requireUserId(request);
  const formData = await request.formData();
  const intent = formData.get("intent");
  const minsiteId = formData.get("minsiteId") as string;

  // Verify user owns this minsite
  const minsite = await prisma.minsite.findUnique({
    where: { id: minsiteId, userId }
  });

  if (!minsite) {
    throw new Response("Unauthorized", { status: 401 });
  }

  switch (intent) {
    case "addProduct": {
      const product = {
        name: formData.get("name") as string,
        description: formData.get("description") as string,
        price: Number(formData.get("price")),
        image: formData.get("image") as string | undefined,
        category: formData.get("category") as string | undefined,
      };

      const updatedMinsite = await prisma.minsite.update({
        where: { id: minsiteId },
        data: {
          components: {
            push: {
              type: "product",
              content: JSON.stringify(product),
              style: {}
            }
          }
        }
      });

      return json({ success: true, components: updatedMinsite.components });
    }

    case "removeProduct": {
      const productId = formData.get("productId") as string;
      const currentComponents = minsite.components as any[];
      
      const updatedMinsite = await prisma.minsite.update({
        where: { id: minsiteId },
        data: {
          components: currentComponents.filter(c => 
            c.type !== "product" || 
            JSON.parse(c.content).id !== productId
          )
        }
      });

      return json({ success: true, components: updatedMinsite.components });
    }

    default:
      return json({ error: "Invalid intent" }, { status: 400 });
  }
}
