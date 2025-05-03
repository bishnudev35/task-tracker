import Router from 'express';
import authMiddleware from '../middelwear/auth.middelwear.js';
import prisma from '../lib/db.js';

const router = Router();
router.get('/fetchAllTask',authMiddleware, async (req, res) => {
   try {
    const {id}=req.user;
    console.log("id",id)// Extract user info from request body
    if (!id) {
        return res.status(400).json({ message: 'User ID is required' })
    }
    const tasks = await prisma.task.findMany({
        where: { userId: id },
    })
    if (!tasks) {
        return res.status(500).json({ message: 'Failed to fetch tasks' })
    }
    res.status(200).json({
        message: 'Tasks fetched successfully',
        tasks: tasks.map(task => ({
            id: task.id,
            title: task.title,
            description: task.description,
            status: task.status,
            time: task.createdAt.toISOString(), // Convert to ISO string for better readability
        })),
    })
   } catch (error) {
        console.error('Error during fetching tasks:', error)
        res.status(500).json({ message: 'Internal server error' })
    }
    
   
})
export default router;