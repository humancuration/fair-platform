import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { fetchTestimonials } from '../store/slices/testimonialsSlice';
import Header from '../components/Header';
import Footer from '../components/Footer';
import TestimonialCard from '../components/TestimonialCard';
import { toast } from 'react-toastify';
import SupportForm from '@components/SupportForm';

const TestimonialsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { testimonials, loading, error } = useAppSelector(state => state.testimonials);

  useEffect(() => {
    dispatch(fetchTestimonials());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  return (
    <div>
      <Header />
      <main className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">What Our Community Says</h1>
        {loading ? (
          <p>Loading testimonials...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {testimonials.map((testimonial) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default TestimonialsPage;