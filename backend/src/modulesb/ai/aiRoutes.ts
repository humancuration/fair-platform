import { Router } from 'express';
import axios from 'axios';

const router = Router();

router.get('/recommendations', async (req, res) => {
  const userId = req.query.user_id;
  try {
    const response = await axios.get(`http://ai_service:5001/recommend`, {
      params: { user_id: userId },
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching recommendations' });
  }
});

export default router;
