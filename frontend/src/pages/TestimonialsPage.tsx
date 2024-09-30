import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import TestimonialCard from '../components/TestimonialCard';
import api from '../utils/api';
import { toast } from 'react-toastify';
import LoadingSpinner from '../components/LoadingSpinner';

interface Testimonial {
  id: string;
  user: string;
  content: string;
  avatar: string;
  date: string;
}

const TestimonialsPage: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await api.get('/testimonials');
        setTestimonials(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching testimonials:', error);
        toast.error('Failed to load testimonials.');
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  return (
    <Layout>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-8">What Our Community Says</h1>
        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default TestimonialsPage;