import Router from 'express'
import authMiddleware from '../middelwear/auth.middelwear.js'
import prisma from '../lib/db.js'
const router = Router()

router.post('/creatTask',authMiddleware, async (req, res) => {
try {
    console.log("req.body",req.body.user)
    const {id}=req.body.user; 
    if(!id){
        return res.status(401).json({ message: 'user not found' });}
            // Extract user info from request body
    const {title,description} = req.body
    if( !id || !title || !description) {
        return res.status(400).json({ message: 'All fields are required' })
    }
    
    const newTask = await prisma.task.create({
        data: {
            userId:id,
            title,
            description,
          
        },
    })
    if (!newTask) {
        return res.status(500).json({ message: 'Failed to create task' })
    }
    res.status(201).json({
        message: 'Task created successfully',
        task: {
            id: newTask.id,
            title: newTask.title,
            description: newTask.description,
            status:"pending"
        },
    })
} catch (error) {
    console.error('Error during registration:', error)
    res.status(500).json({ message: 'Internal server error' })
    
}
})
export default router