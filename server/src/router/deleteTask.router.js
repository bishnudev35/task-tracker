import Router from 'express';
import authMiddleware from '../middelwear/auth.middelwear.js';
import prisma from '../lib/db.js';

const router = Router();
router.delete('/deleteTask', authMiddleware, async (req, res) => {
    try {
        const { id } = req.body.user; // Extract user info from request body
        if (!id) {
            return res.status(401).json({ message: 'User not found' });
        }
        const { taskId} = req.body; // Extract taskId from request body
        if (!taskId) {
            return res.status(400).json({ message: 'Task ID is required' });
        }

        const deletedTask = await prisma.task.delete({
            where: { id: taskId ,userId:id },
        });

        if (!deletedTask) {
            return res.status(500).json({ message: 'Failed to delete task' });
        }

        res.status(200).json({
            message: 'Task deleted successfully',
             task: {
                id: deletedTask.id,
                title: deletedTask.title,
                description: deletedTask.description,
                status: deletedTask.status
        },
        });
    } catch (error) {
        console.error('Error during task deletion:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
})
export default router;