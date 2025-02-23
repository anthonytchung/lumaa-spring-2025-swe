import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateJWT } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

router.use(authenticateJWT);

// Get tasks for the authenticated user
router.get('/', async (req, res) => {
  const userId = (req as any).userId;
  try {
    const tasks = await prisma.task.findMany({
      where: { userId },
    });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new task
router.post('/', async (req, res) => {
  const userId = (req as any).userId;
  const { title, description } = req.body;
  try {
    const task = await prisma.task.create({
      data: {
        title,
        description,
        user: { connect: { id: userId } },
      },
    });
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a task
router.put('/:id', async (req, res) => {
  const userId = (req as any).userId;
  const taskId = parseInt(req.params.id);
  const { title, description, isComplete } = req.body;
  try {
    const existingTask = await prisma.task.findFirst({
      where: { id: taskId, userId },
    });
    if (!existingTask) return res.sendStatus(404);

    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: { title, description, isComplete },
    });
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a task
router.delete('/:id', async (req, res) => {
  const userId = (req as any).userId;
  const taskId = parseInt(req.params.id);
  try {
    const existingTask = await prisma.task.findFirst({
      where: { id: taskId, userId },
    });
    if (!existingTask) return res.sendStatus(404);

    await prisma.task.delete({ where: { id: taskId } });
    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
