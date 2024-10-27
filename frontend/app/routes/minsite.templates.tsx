import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { requireUserId } from "~/utils/session.server";
import { prisma } from "~/utils/db.server";
import { TemplateSelector } from "~/components/minsite/TemplateSelector";
import { ThemeCustomizer } from "~/components/minsite/ThemeCustomizer";

export async function loader({ request }: LoaderFunctionArgs) {
  const userId = await requireUserId(request);
  
  const templates = await prisma.template.findMany({
    where: {
      OR: [
        { userId },
        { isPublic: true }
      ]
    }
  });

  return json({ templates });
}

export default function TemplatesRoute() {
  const { templates } = useLoaderData<typeof loader>();
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Minsite Templates</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Choose a Template</h2>
          <TemplateSelector
            templates={templates}
            selected=""
            onSelect={() => {}}
          />
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-4">Customize Theme</h2>
          <ThemeCustomizer
            theme={{
              colors: {
                primary: "#3B82F6",
                secondary: "#10B981",
                background: "#FFFFFF",
                text: "#1F2937",
                accent: "#F59E0B"
              },
              typography: {
                headingFont: "sans-serif",
                bodyFont: "sans-serif",
                scale: 1.2
              },
              spacing: {
                unit: 4,
                scale: 1.5
              }
            }}
            onChange={() => {}}
          />
        </div>
      </div>
    </div>
  );
}
