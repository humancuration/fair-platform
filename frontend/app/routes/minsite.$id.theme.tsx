import { json, type LoaderFunctionArgs, type ActionFunctionArgs } from "@remix-run/node";
import { useLoaderData, useSubmit } from "@remix-run/react";
import { requireUserId } from "~/utils/session.server";
import { prisma } from "~/utils/db.server";
import { ThemeCustomizer } from "~/components/minsite/ThemeCustomizer";
import { ThemePreview } from "~/components/minsite/ThemePreview";
import { validateTheme } from "~/utils/theme.server";
import type { Theme } from "~/types/models";

export async function loader({ params, request }: LoaderFunctionArgs) {
  const userId = await requireUserId(request);
  
  const minsite = await prisma.minsite.findUnique({
    where: { id: params.id, userId },
    select: { settings: true }
  });

  if (!minsite) {
    throw new Response("Not Found", { status: 404 });
  }

  const settings = minsite.settings as { theme?: Theme };
  return json({ theme: settings.theme });
}

export async function action({ params, request }: ActionFunctionArgs) {
  const userId = await requireUserId(request);
  const formData = await request.formData();
  const theme = JSON.parse(formData.get("theme") as string);

  if (!validateTheme(theme)) {
    return json({ error: "Invalid theme data" }, { status: 400 });
  }

  const minsite = await prisma.minsite.update({
    where: { id: params.id, userId },
    data: {
      settings: {
        theme
      }
    }
  });

  return json({ success: true, minsite });
}

export default function ThemeRoute() {
  const { theme } = useLoaderData<typeof loader>();
  const submit = useSubmit();

  const handleThemeChange = (newTheme: Theme) => {
    const formData = new FormData();
    formData.set("theme", JSON.stringify(newTheme));
    submit(formData, { method: "post" });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Theme Customization</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <ThemeCustomizer
            theme={theme}
            onChange={handleThemeChange}
          />
        </div>
        
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Preview</h2>
          <ThemePreview
            theme={theme}
            onSelect={() => {}}
          />
        </div>
      </div>
    </div>
  );
}
