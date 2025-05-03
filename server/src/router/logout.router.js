import Router from 'express';
import authMiddleware from '../middelwear/auth.middelwear.js';
import prisma from '../lib/db.js';
const router = Router();
router.post('/logout', authMiddleware, async (req, res) => {
   try {
    const {id}=req.body.user;
    console.log("iddddddd",id) // Extract user info from request body
    if (!id) {
        return res.status(401).json({ message: 'User not found' });
    }
    const logoutUser = await prisma.user.update({
        where: { id: id },
        data: { longTermToken:undefined }, // Assuming you have a field to track login status
    });
    if (!logoutUser) {
        return res.status(500).json({ message: 'Failed to logout user' });
    }
    res.status(200).json({
        message: 'User logged out successfully',})
   } catch (error) {
        console.error('Error during logout:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
    
   }
)
export default router;