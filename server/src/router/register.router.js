import Router from 'express'
import prisma from '../lib/db.js'
import bcrypt from 'bcrypt'
import JwtSign from '../util/jwt.js'
import{ jwtLongSign } from '../util/jwt.js'
const router = Router()

router.post('/register', async (req, res) => {
try {
    const { name,email, password,Country } = req.body
    if (!name || !email || !password || !Country) {
        return res.status(400).json({ message: 'All fields are required' })
    }
    const existingUser = await prisma.user.findUnique({
        where: { email },
    })
    if (existingUser) {
        return res.status(400).json({ message: 'User already exists' })
    }
    const hasPassword = await bcrypt.hash(password, 10);
    const longTermToken = jwtLongSign(email, process.env.JWT_SECRET)
    const newUser = await prisma.user.create({
        data: {
            name,
            email,
            password: hasPassword,
            Country,
            longTermToken:longTermToken, // Store the long-term token in the database
        },
    })
    if (!newUser) {
        return res.status(500).json({ message: 'Failed to create user' })
    }
    const token = JwtSign(newUser, process.env.JWT_SECRET)

    res.status(201).json({
        message: 'User registered successfully',
        user: {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            Country: newUser.Country
        },
        token,
        longTermToken:longTermToken // Include the long-term token in the response
    })
} catch (error) {
    console.error('Error during registration:', error)
    res.status(500).json({ message: 'Internal server error' })
    
}
})
export default router;