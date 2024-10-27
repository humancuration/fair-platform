import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { requireUserId } from "~/utils/session.server";
import { prisma } from "~/utils/db.server";
import { ProjectShowcase } from "~/components/community/ProjectShowcase";
import { LoadingVibes } from "~/components/community/LoadingVibes";

const funTitles = [
  "Project Showcase Extravaganza ✨",
  "Look What We Made! 🎨",
  "The Innovation Zone 🚀",
  "Community Builds Gallery 🏗️",
  "Cool Stuff Central 😎",
  "The Maker Space 🛠️",
  "Show & Tell Time! 🌟",
];

const filterCategories = [
  { id: "trending", label: "🔥 Trending", color: "bg-red-100 text-red-700" },
  { id: "latest", label: "✨ Latest", color: "bg-blue-100 text-blue-700" },
  { id: "ai", label: "🤖 AI/ML", color: "bg-purple-100 text-purple-700" },
  { id: "creative", label: "🎨 Creative", color: "bg-pink-100 text-pink-700" },
  { id: "tech", label: "💻 Tech", color: "bg-green-100 text-green-700" },
  { id: "science", label: "🔬 Science", color: "bg-yellow-100 text-yellow-700" },
  { id: "impact", label: "🌍 Impact", color: "bg-indigo-100 text-indigo-700" },
];

export async function loader({ request }: LoaderFunctionArgs) {
  const userId = await requireUserId(request);
  const url = new URL(request.url);
  const category = url.searchParams.get("category") || "trending";
  
  const projects = await prisma.project.findMany({
    where: {
      OR: [
        { userId },
        { isPublic: true }
      ],
      ...(category !== "trending" && category !== "latest" 
        ? { category } 
        : {})
    },
    include: {
      team: {
        include: {
          user: {
            select: {
              id: true,
              username: true,
              avatar: true
            }
          }
        }
      },
      milestones: {
        orderBy: { date: "desc" },
        take: 5
      }
    },
    orderBy: category === "trending" 
      ? { impact: { happiness: "desc" } }
      : { updatedAt: "desc" },
    take: 50
  });

  return json({ projects });
}

export default function ShowcaseRoute() {
  const { projects } = useLoaderData<typeof loader>();
  const [activeCategory, setActiveCategory] = useState("trending");
  const [title] = useState(() => 
    funTitles[Math.floor(Math.random() * funTitles.length)]
  );
  const fetcher = useFetcher();

  if (!projects) {
    return <LoadingVibes />;
  }

  return (
    <div className="container mx-auto p-4 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
          {title}
        </h1>
        <p className="text-gray-600 mt-2">
          Check out what our amazing community is building! 🚀
        </p>
      </motion.div>

      {/* Category Filters */}
      <motion.div 
        className="flex flex-wrap justify-center gap-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {filterCategories.map((category, index) => (
          <motion.button
            key={category.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => {
              setActiveCategory(category.id);
              fetcher.load(`/community/showcase?category=${category.id}`);
            }}
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              activeCategory === category.id
                ? category.color
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {category.label}
          </motion.button>
        ))}
      </motion.div>

      {/* Projects Grid */}
      <motion.div
        layout
        className="grid grid-cols-1 lg:grid-cols-2 gap-8"
      >
        <AnimatePresence mode="popLayout">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ delay: index * 0.1 }}
            >
              <ProjectShowcase
                title={project.title}
                description={project.description}
                status={project.status}
                team={project.team.map(member => ({
                  id: member.user.id,
                  name: member.user.username,
                  avatar: member.user.avatar,
                  role: member.role,
                  contributions: member.contributions
                }))}
                milestones={project.milestones}
                tags={project.tags}
                impact={{
                  users: project.impact.users,
                  revenue: project.impact.revenue,
                  happiness: project.impact.happiness
                }}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Empty State */}
      {projects.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <p className="text-2xl mb-4">No projects yet in this category! 🌱</p>
          <p className="text-gray-600">
            Be the first to share something amazing!
          </p>
        </motion.div>
      )}
    </div>
  );
}
