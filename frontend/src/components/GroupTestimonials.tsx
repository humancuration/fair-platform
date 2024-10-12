import React, { useEffect, useState } from 'react';
import api from '@api/api';
import Card from './common/Card';

interface Testimonial {
  id: string;
  user: string;
  content: string;
  group: string;
}

const GroupTestimonials: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await api.get('/testimonials/groups');
        setTestimonials(response.data);
      } catch (error) {
        console.error('Error fetching group testimonials:', error);
      }
    };

    fetchTestimonials();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {testimonials.map((testimonial) => (
        <Card key={testimonial.id} title={`Group: ${testimonial.group}`}>
          <p>{testimonial.content}</p>
          <p className="mt-2 text-sm text-gray-500">- {testimonial.user}</p>
        </Card>
      ))}
    </div>
  );
};

export default GroupTestimonials;