import Router from 'express'
import prisma from '../lib/db.js'
import bcrypt from 'bcrypt' 
import JwtSign, { jwtLongSign } from '../util/jwt.js'
const router = Router()

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(400).json({ message: 'All fields are required' })
        }
        const user = await prisma.user.findUnique({
            where: { email },
        })
        if (!user) {
            return res.status(401).json({ message: 'Invalid email' })
        }
        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid password' })
        }
        const longTermToken =jwtLongSign(email,process.env.JWT_SECRET); // Retrieve the long-term token from the database
        const token = JwtSign(user, process.env.JWT_SECRET)
        const updatedUser = await prisma.user.update({
            where: { id: user.id },
            data: { longTermToken: longTermToken }, // Update the long-term token in the database
        })
        if (!updatedUser) {
            return res.status(500).json({ message: 'Failed to login' })
        }
        res.status(200).json({
            message: 'Login successful',
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                Country: user.Country
            },
            token,longTermToken:longTermToken // Include the long-term token in the response
        })
    } catch (error) {
        console.error('Error during login:', error)
        res.status(500).json({ message: 'Internal server error' })
    }
})
export default router