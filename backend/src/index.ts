import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import authRoutes from './routes/auth';
import taskRoutes from './routes/tasks';

const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/auth', authRoutes);
app.use('/tasks', taskRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
