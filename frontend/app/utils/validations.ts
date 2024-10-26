import * as yup from 'yup';

export const campaignSchema = yup.object({
  title: yup.string().required('Title is required'),
  description: yup.string().required('Description is required'),
  goal: yup.number().required('Goal amount is required').positive('Goal must be positive'),
  deadline: yup.date().required('Deadline is required').min(new Date(), 'Deadline must be in the future'),
  category: yup.string().required('Category is required'),
  image: yup.string().url('Must be a valid URL'),
});

export const supportSchema = yup.object({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  message: yup.string().required('Message is required'),
});

export const settingsSchema = yup.object({
  notificationsEnabled: yup.boolean(),
  theme: yup.string().oneOf(['light', 'dark']),
  fediverseProfile: yup.string().url('Invalid URL').nullable(),
});
