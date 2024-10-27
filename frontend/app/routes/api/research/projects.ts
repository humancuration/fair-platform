import { json, ActionFunction } from "@remix-run/node";
import { 
  createResearchProject, 
  getResearchProjects,
  updateResearchProject 
} from "~/services/research-projects.server";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const intent = formData.get("intent");

  switch (intent) {
    case "create":
      const project = await createResearchProject({
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        type: formData.get("type") as string,
        stage: formData.get("stage") as string,
        resources: JSON.parse(formData.get("resources") as string),
        team: JSON.parse(formData.get("team") as string),
      });
      return json({ project });

    case "update":
      const updatedProject = await updateResearchProject(
        formData.get("id") as string,
        JSON.parse(formData.get("updates") as string)
      );
      return json({ project: updatedProject });

    default:
      return json({ error: "Invalid intent" }, { status: 400 });
  }
};
