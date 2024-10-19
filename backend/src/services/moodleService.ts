import axios from 'axios';
import logger from '../utils/logger';

const MOODLE_URL = process.env.MOODLE_URL;
const MOODLE_TOKEN = process.env.MOODLE_TOKEN;

interface MoodleUser {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface MoodleCourse {
  fullname: string;
  shortname: string;
  categoryid: number;
  summary: string;
}

const moodleRequest = async (wsfunction: string, params: any) => {
  try {
    const response = await axios.get(`${MOODLE_URL}/webservice/rest/server.php`, {
      params: {
        wstoken: MOODLE_TOKEN,
        wsfunction,
        moodlewsrestformat: 'json',
        ...params,
      },
    });
    return response.data;
  } catch (error) {
    logger.error(`Moodle API error (${wsfunction}):`, error);
    throw new Error(`Moodle API request failed: ${error.message}`);
  }
};

export const createMoodleUser = async (user: MoodleUser): Promise<number> => {
  const data = await moodleRequest('core_user_create_users', {
    users: JSON.stringify([{
      username: user.username,
      password: user.password,
      firstname: user.firstName,
      lastname: user.lastName,
      email: user.email,
    }]),
  });
  logger.info(`Created Moodle user: ${data[0].id}`);
  return data[0].id;
};

export const enrollUserInCourse = async (userId: number, courseId: number): Promise<void> => {
  await moodleRequest('enrol_manual_enrol_users', {
    enrolments: JSON.stringify([{
      roleid: 5, // Student role
      userid: userId,
      courseid: courseId,
    }]),
  });
  logger.info(`Enrolled user ${userId} in course ${courseId}`);
};

export const createAIEthicsCourse = async (courseData: MoodleCourse): Promise<number> => {
  const data = await moodleRequest('core_course_create_courses', {
    courses: JSON.stringify([{
      fullname: courseData.fullname,
      shortname: courseData.shortname,
      categoryid: courseData.categoryid,
      summary: courseData.summary,
      format: 'topics',
      numsections: 5,
      customfields: [
        {
          shortname: 'aiethics',
          value: 'true'
        }
      ]
    }]),
  });
  logger.info(`Created AI Ethics course: ${data[0].id}`);
  return data[0].id;
};

export const addReflectionActivity = async (courseId: number, sectionId: number, reflectionPrompt: string): Promise<number> => {
  const data = await moodleRequest('mod_forum_add_discussion', {
    forumid: sectionId,
    subject: 'Reflection on AI-Human Interaction',
    message: reflectionPrompt,
    options: JSON.stringify([{name: 'discussionsubscribe', value: 1}]),
  });
  logger.info(`Added reflection activity to course ${courseId}, section ${sectionId}`);
  return data.discussionid;
};

// Add more Moodle API interactions as needed
