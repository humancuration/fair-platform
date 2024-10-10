import React, { useEffect, useState } from 'react';
import api from '../services/api';

const MoodleCourses: React.FC = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      const response = await api.get('/moodle/user-courses');
      setCourses(response.data);
    };
    fetchCourses();
  }, []);

  return (
    <div>
      <h2>My Courses</h2>
      {courses.map(course => (
        <div key={course.id}>
          <h3>{course.fullname}</h3>
          <p>{course.summary}</p>
        </div>
      ))}
    </div>
  );
};

export default MoodleCourses;