import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { motion } from 'framer-motion';
import { FaRobot, FaBrain, FaChartLine, FaUsers } from 'react-icons/fa';
import { prisma } from "~/db.server";

interface AIProject {
  id: string;
  name: string;
  description: string;
  category: string;
  collaborators: number;
  upvotes: number;
  techStack: string[];
}

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const category = url.searchParams.get("category") || "all";

  const projects = await prisma.aiProject.findMany({
    where: category !== "all" ? { category } : undefined,
    select: {
      id: true,
      name: true,
      description: true,
      category: true,
      collaborators: true,
      upvotes: true,
      techStack: true
    }
  });

  return json({ projects });
}

export default function AICommunityHub() {
  const { projects } = useLoaderData<typeof loader>();
  
  const categories = [
    { id: 'all', name: 'All Projects', icon: FaRobot },
    { id: 'nlp', name: 'Natural Language', icon: FaBrain },
    { id: 'vision', name: 'Computer Vision', icon: FaChartLine },
    { id: 'collab', name: 'Collaborations', icon: FaUsers },
  ];

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">AI Community Hub</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {categories.map(category => (
          <motion.div
            key={category.id}
            whileHover={{ scale: 1.05 }}
            className={`p-4 rounded-lg cursor-pointer ${
              category.id === new URLSearchParams(window.location.search).get("category")
                ? 'bg-purple-600 text-white'
                : 'bg-white border'
            }`}
            onClick={() => {
              const searchParams = new URLSearchParams(window.location.search);
              searchParams.set("category", category.id);
              window.location.search = searchParams.toString();
            }}
          >
            <category.icon className="text-2xl mb-2" />
            <h3 className="font-semibold">{category.name}</h3>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {projects.map((project) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="border rounded-lg p-6 bg-white shadow-sm"
          >
            <h3 className="text-xl font-bold mb-2">{project.name}</h3>
            <p className="text-gray-600 mb-4">{project.description}</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {project.techStack.map(tech => (
                <span key={tech} className="px-2 py-1 bg-gray-100 rounded-full text-sm">
                  {tech}
                </span>
              ))}
            </div>
            <div className="flex justify-between text-sm text-gray-500">
              <span>{project.collaborators} collaborators</span>
              <span>{project.upvotes} upvotes</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
