import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, useSearchParams, Form } from "@remix-run/react";
import { motion } from 'framer-motion';
import { FaGraduationCap, FaBook, FaVideo, FaCode } from 'react-icons/fa';
import { prisma } from "~/db.server";

interface Resource {
  id: string;
  title: string;
  type: 'article' | 'video' | 'code' | 'course';
  difficulty: string;
  duration: string;
  author: string;
  rating: number;
  tags: string[];
}

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const type = url.searchParams.get("type") || "all";
  const query = url.searchParams.get("q") || "";

  const resources = await prisma.resource.findMany({
    where: {
      AND: [
        type !== "all" ? { type } : {},
        query ? {
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { tags: { hasSome: [query] } }
          ]
        } : {}
      ]
    }
  });

  return json({ resources });
}

export default function AILearningHub() {
  const { resources } = useLoaderData<typeof loader>();
  const [searchParams] = useSearchParams();

  const resourceTypes = [
    { id: 'all', name: 'All Resources', icon: FaGraduationCap },
    { id: 'article', name: 'Articles', icon: FaBook },
    { id: 'video', name: 'Videos', icon: FaVideo },
    { id: 'code', name: 'Code Examples', icon: FaCode },
  ];

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">AI Learning Hub</h1>

      <Form method="get" className="mb-8">
        <input
          type="text"
          name="q"
          defaultValue={searchParams.get("q") || ""}
          placeholder="Search resources..."
          className="w-full p-3 border rounded-lg"
        />
      </Form>

      <div className="flex gap-4 mb-8 overflow-x-auto">
        {resourceTypes.map(type => (
          <Form key={type.id} method="get">
            <input 
              type="hidden" 
              name="q" 
              value={searchParams.get("q") || ""} 
            />
            <motion.button
              type="submit"
              name="type"
              value={type.id}
              whileHover={{ scale: 1.05 }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                searchParams.get("type") === type.id
                  ? 'bg-purple-600 text-white'
                  : 'bg-white border'
              }`}
            >
              <type.icon />
              <span>{type.name}</span>
            </motion.button>
          </Form>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resources.map((resource) => (
          <motion.div
            key={resource.id}
            whileHover={{ y: -5 }}
            className="border rounded-lg p-6 bg-white shadow-sm"
          >
            <div className="flex items-center gap-2 mb-4">
              {resource.type === 'article' && <FaBook className="text-blue-500" />}
              {resource.type === 'video' && <FaVideo className="text-red-500" />}
              {resource.type === 'code' && <FaCode className="text-green-500" />}
              <h3 className="text-xl font-bold">{resource.title}</h3>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {resource.tags.map(tag => (
                <span key={tag} className="px-2 py-1 bg-gray-100 rounded-full text-sm">
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex justify-between text-sm text-gray-500">
              <span>{resource.duration}</span>
              <span>{resource.difficulty}</span>
              <span>⭐ {resource.rating}/5</span>
            </div>

            <div className="mt-4 text-sm text-gray-600">
              By {resource.author}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
