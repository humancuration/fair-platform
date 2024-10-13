import express from 'express';
import { userAPI } from '../datasources/UserAPI'; // Corrected import to match the exported member

const router = express.Router();

// Example user-related endpoints
router.post('/users', async (req, res) => {
  try {
    const user = await userAPI.createUser(req.body); // Implement createUser in UserAPI
    res.status(201).json(user);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Failed to create user.' });
  }
});

router.get('/users/:id', async (req, res) => {
  try {
    const user = await userAPI.getUserById(req.params.id); // Implement getUserById in UserAPI
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Failed to fetch user.' });
  }
});

// Add more endpoints as needed
// For example, updateUser, deleteUser, etc.

export default router;
