import Router from 'express'
import authMiddleware from '../middelwear/auth.middelwear.js';
import prisma from '../lib/db.js'

const router=Router();
router.post('/updateTask',authMiddleware, async (req, res) => {
try {
    console.log("jhfgjbjh")
 const user=req.body.user; // Extract user info from request body
 if(user){
    const {id}=user.id; // Extract user ID from request body
    const {taskId,status}=req.body; // Extract taskId and status from request body
    if (!taskId || !status) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    const updatedTask = await prisma.task.update({
        where: { id: taskId,userId:id },
        data: { status: status },
    })
    if (!updatedTask) {
        return res.status(500).json({ message: 'Failed to update task' })
    }
    return res.status(200).json({
        message: 'Task updated successfully',
        task: {
            id: updatedTask.id,
            title: updatedTask.title,
            description: updatedTask.description,
            status: updatedTask.status
        },
    })
 }else{
    return res.status(401).json({ message: 'user not found' });
 }
} catch (error) {
       console.error('Error during task Updating:', error)
    res.status(500).json({ message: 'Internal server error' })
}
})
export default router;