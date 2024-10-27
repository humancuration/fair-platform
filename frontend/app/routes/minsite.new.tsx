import { json, redirect, type ActionFunctionArgs } from "@remix-run/node";
import { Form } from "@remix-run/react";
import { requireUserId } from "~/utils/session.server";
import { createMinsite } from "~/services/minsite.server";

export async function action({ request }: ActionFunctionArgs) {
  const userId = await requireUserId(request);
  const formData = await request.formData();

  const minsite = await createMinsite({
    title: formData.get("title") as string,
    content: JSON.parse(formData.get("content") as string),
    template: formData.get("template") as string,
    customCSS: formData.get("customCSS") as string,
    seoMetadata: JSON.parse(formData.get("seoMetadata") as string),
    components: JSON.parse(formData.get("components") as string),
    settings: JSON.parse(formData.get("settings") as string),
    userId
  });

  return redirect(`/minsite/${minsite.id}`);
}

export default function NewMinsitePage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Create New Minsite</h1>
      <Form method="post">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              name="title"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Template</label>
            <select
              name="template"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="blank">Blank</option>
              <option value="blog">Blog</option>
              <option value="portfolio">Portfolio</option>
              <option value="landing">Landing Page</option>
              <option value="ecommerce">E-commerce</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Create Minsite
          </button>
        </div>
      </Form>
    </div>
  );
}
