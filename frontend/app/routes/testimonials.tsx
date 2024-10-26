import { json, type LoaderFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { motion, AnimatePresence } from 'framer-motion';
import { getTestimonials } from '~/services/testimonials.server';
import TestimonialCard from '~/components/testimonials/TestimonialCard';
import GroupTestimonials from '~/components/groups/GroupTestimonials';
import type { Testimonial } from '~/types';

interface LoaderData {
  testimonials: Testimonial[];
}

export const loader: LoaderFunction = async () => {
  const testimonials = await getTestimonials();
  return json<LoaderData>({ testimonials });
};

export default function Testimonials() {
  const { testimonials } = useLoaderData<typeof loader>();

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">What Our Community Says</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <TestimonialCard testimonial={testimonial} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {testimonials.length === 0 && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-gray-500 mt-8"
        >
          No testimonials available yet.
        </motion.p>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-12"
      >
        <h2 className="text-xl font-semibold mb-4">Group Testimonials</h2>
        <GroupTestimonials />
      </motion.div>
    </div>
  );
}
