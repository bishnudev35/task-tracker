import Router from 'express';
import authMiddleware from '../middelwear/auth.middelwear.js';
import prisma from '../lib/db.js';

const router = Router();    

router.get('/profile',authMiddleware, async(req, res) => {
try {
    const user = req.user; // Extract user info from request object
if (!user) {
    return res.status(401).json({ message: 'User not found' });
}

const newUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: {
        id: true,
        name: true,
        email: true,
        Country:true,
        createdAt: true,
        // Add any other user fields you want to return
    },
});
if (!newUser) {
    return res.status(404).json({ message: 'User not found' });
} 
return res.status(200).json({
    message: 'Profile fetched successfully',
    user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        country:newUser.Country,
        createdAt: newUser.createdAt.toISOString(), // Convert to ISO string for better readability
        // Add any other user fields you want to return
    },})
} catch (error) {
    console.error('Error during fetching profile:', error)
    res.status(500).json({ message: 'Internal server error' })
    
}
})
export default router;