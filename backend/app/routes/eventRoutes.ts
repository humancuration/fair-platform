import express from 'express';
import {
  createEvent,
  getEventsByGroup,
  getEventById,
  updateEvent,
  deleteEvent,
  rsvpEvent,
} from '../controllers/eventController';
import auth from '../middleware/auth';

const router = express.Router();

// Event CRUD Routes
router.post('/', auth, createEvent);
router.get('/group/:groupId', getEventsByGroup);
router.get('/:eventId', getEventById);
router.put('/:eventId', auth, updateEvent);
router.delete('/:eventId', auth, deleteEvent);

// RSVP Route
router.post('/:eventId/rsvp', auth, rsvpEvent);

export default router;