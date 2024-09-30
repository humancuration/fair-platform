import React from 'react';

interface Testimonial {
  id: string;
  user: string;
  content: string;
  avatar: string;
  date: string;
}

interface TestimonialCardProps {
  testimonial: Testimonial;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ testimonial }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <div className="flex items-center mb-4">
        <img src={testimonial.avatar} alt={`${testimonial.user}'s avatar`} className="w-12 h-12 rounded-full mr-4" />
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{testimonial.user}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">{new Date(testimonial.date).toLocaleDateString()}</p>
        </div>
      </div>
      <p className="text-gray-700 dark:text-gray-300">{testimonial.content}</p>
    </div>
  );
};

export default TestimonialCard;