import express from 'express';
import mongoose from 'mongoose';
import { DATABASE_URL, PORT } from './config/constants';
import errorHandler from './middleware/errorHandler';
import routes from './routes';
import testimonialRoutes from './routes/testimonialRoutes';
import wishlistRoutes from './routes/wishlistRoutes';
import communityWishlistRoutes from './routes/communityWishlistRoutes';
import cors from 'cors';

const app = express();

mongoose
  .connect(DATABASE_URL)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));

app.use(cors());
app.use(express.json());
app.use('/api', routes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/user', wishlistRoutes);
app.use('/api/community-wishlist', communityWishlistRoutes);

// Use the error handler after all routes
app.use(errorHandler);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
