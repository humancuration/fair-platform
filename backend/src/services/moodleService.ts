import axios from 'axios';

const MOODLE_URL = process.env.MOODLE_URL;
const MOODLE_TOKEN = process.env.MOODLE_TOKEN;

export const createMoodleUser = async (user: any) => {
  try {
    const response = await axios.get(`${MOODLE_URL}/webservice/rest/server.php`, {
      params: {
        wstoken: MOODLE_TOKEN,
        wsfunction: 'core_user_create_users',
        moodlewsrestformat: 'json',
        users: JSON.stringify([{
          username: user.username,
          password: user.password,
          firstname: user.firstName,
          lastname: user.lastName,
          email: user.email,
        }]),
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating Moodle user:', error);
    throw error;
  }
};

export const enrollUserInCourse = async (userId: number, courseId: number) => {
  try {
    const response = await axios.get(`${MOODLE_URL}/webservice/rest/server.php`, {
      params: {
        wstoken: MOODLE_TOKEN,
        wsfunction: 'enrol_manual_enrol_users',
        moodlewsrestformat: 'json',
        enrolments: JSON.stringify([{
          roleid: 5, // Student role
          userid: userId,
          courseid: courseId,
        }]),
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error enrolling user in Moodle course:', error);
    throw error;
  }
};

// Add more Moodle API interactions as needed

export const createAIEthicsCourse = async (courseData: any) => {
  try {
    const response = await axios.get(`${MOODLE_URL}/webservice/rest/server.php`, {
      params: {
        wstoken: MOODLE_TOKEN,
        wsfunction: 'core_course_create_courses',
        moodlewsrestformat: 'json',
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
      },
    });
    return response.data[0]; // Returns the created course
  } catch (error) {
    console.error('Error creating AI Ethics course:', error);
    throw error;
  }
};

export const addReflectionActivity = async (courseId: number, sectionId: number, reflectionPrompt: string) => {
  try {
    const response = await axios.get(`${MOODLE_URL}/webservice/rest/server.php`, {
      params: {
        wstoken: MOODLE_TOKEN,
        wsfunction: 'mod_forum_add_discussion',
        moodlewsrestformat: 'json',
        forumid: sectionId,
        subject: 'Reflection on AI-Human Interaction',
        message: reflectionPrompt,
        options: JSON.stringify([{name: 'discussionsubscribe', value: 1}]),
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error adding reflection activity:', error);
    throw error;
  }
};