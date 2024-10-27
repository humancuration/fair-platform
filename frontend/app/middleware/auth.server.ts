import { redirect } from "@remix-run/node";

export async function requireResearchAccess(request: Request) {
  const user = await getUser(request);
  
  if (!user) {
    throw redirect("/login");
  }

  if (!user.hasResearchAccess) {
    throw redirect("/research/request-access");
  }

  return user;
}
