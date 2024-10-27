import { json, type LoaderFunctionArgs, type ActionFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { requireUserId } from "~/utils/session.server";
import { prisma } from "~/utils/db.server";
import { CommunityGroup } from "~/components/community/CommunityGroup";
import { LoadingVibes } from "~/components/community/LoadingVibes";
import { motion } from "framer-motion";

export async function loader({ request }: LoaderFunctionArgs) {
  const userId = await requireUserId(request);
  
  const [mySquads, publicSquads] = await Promise.all([
    prisma.group.findMany({
      where: {
        members: {
          some: { userId }
        }
      },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                avatar: true
              }
            }
          }
        }
      }
    }),
    prisma.group.findMany({
      where: {
        isPublic: true,
        members: {
          none: { userId }
        }
      },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                avatar: true
              }
            }
          }
        }
      },
      take: 5
    })
  ]);

  return json({ mySquads, publicSquads });
}

export async function action({ request }: ActionFunctionArgs) {
  const userId = await requireUserId(request);
  const formData = await request.formData();
  const intent = formData.get("intent");
  const groupId = formData.get("groupId") as string;

  switch (intent) {
    case "join": {
      await prisma.groupMember.create({
        data: {
          groupId,
          userId,
          role: "MEMBER"
        }
      });
      break;
    }
    case "leave": {
      await prisma.groupMember.delete({
        where: {
          groupId_userId: {
            groupId,
            userId
          }
        }
      });
      break;
    }
  }

  return json({ success: true });
}

const funTitles = [
  "Your Squad Vibes ✨",
  "The Bestie Zone 💖",
  "Community Hangout 🌟",
  "Friend Group Check 🎭",
  "The Cool Kids Club 😎",
];

export default function SquadsRoute() {
  const { mySquads, publicSquads } = useLoaderData<typeof loader>();
  const [title] = useState(() => 
    funTitles[Math.floor(Math.random() * funTitles.length)]
  );

  if (!mySquads || !publicSquads) {
    return <LoadingVibes />;
  }

  return (
    <div className="container mx-auto p-4">
      <motion.h1 
        className="text-2xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {title}
      </motion.h1>

      <div className="space-y-8">
        <section>
          <h2 className="text-xl font-semibold mb-4">Your Squads</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mySquads.map((squad) => (
              <CommunityGroup
                key={squad.id}
                name={squad.name}
                description={squad.description}
                members={squad.members.map(m => ({
                  userId: m.user.id,
                  username: m.user.username,
                  avatar: m.user.avatar,
                  role: m.role
                }))}
                isPrivate={!squad.isPublic}
                currentUserId={squad.members[0].userId}
              />
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">Discover Squads</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {publicSquads.map((squad) => (
              <CommunityGroup
                key={squad.id}
                name={squad.name}
                description={squad.description}
                members={squad.members.map(m => ({
                  userId: m.user.id,
                  username: m.user.username,
                  avatar: m.user.avatar,
                  role: m.role
                }))}
                isPrivate={false}
                currentUserId={squad.members[0].userId}
                onJoin={() => {
                  const formData = new FormData();
                  formData.set("intent", "join");
                  formData.set("groupId", squad.id);
                  submit(formData, { method: "post" });
                }}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
