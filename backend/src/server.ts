import express from 'express';
import mongoose from 'mongoose';
import { DATABASE_URL, PORT } from './config/constants';
import errorHandler from './middleware/errorHandler';
import routes from './routes';
import cors from 'cors';

const app = express();

mongoose
  .connect(DATABASE_URL)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));

app.use(cors());
app.use(express.json());
app.use('/api', routes);

app.use(errorHandler);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
