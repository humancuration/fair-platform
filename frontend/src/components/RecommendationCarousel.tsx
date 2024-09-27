import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const RecommendationCarousel: React.FC = () => {
  const recommendations = [
    { id: 1, title: 'Featured Product 1', image: '/path/to/image1.jpg' },
    { id: 2, title: 'Featured Product 2', image: '/path/to/image2.jpg' },
    { id: 3, title: 'Featured Product 3', image: '/path/to/image3.jpg' },
  ];

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold mb-4">Recommended for You</h2>
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={30}
        slidesPerView={3}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000 }}
      >
        {recommendations.map(product => (
          <SwiperSlide key={product.id}>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <img src={product.image} alt={product.title} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h3 className="text-lg font-semibold">{product.title}</h3>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default RecommendationCarousel;