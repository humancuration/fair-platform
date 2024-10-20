import express from 'express';
import { UserService } from '../modulesb/user/userService';

const router = express.Router();
const userService = new UserService();

// Example user-related endpoints
router.post('/users', async (req, res) => {
  try {
    const user = await userService.createUser(req.body);
    res.status(201).json(user);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Failed to create user.' });
  }
});

router.get('/users/:id', async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found.' });
    }
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Failed to fetch user.' });
  }
});

router.put('/users/:id', async (req, res) => {
  try {
    const user = await userService.updateUser(req.params.id, req.body);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found.' });
    }
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Failed to update user.' });
  }
});

router.delete('/users/:id', async (req, res) => {
  try {
    const deleted = await userService.deleteUser(req.params.id);
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: 'User not found.' });
    }
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Failed to delete user.' });
  }
});

// Add more endpoints as needed
// For example, updateUser, deleteUser, etc.

export default router;
