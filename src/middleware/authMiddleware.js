import jwt from 'jsonwebtoken'
import { prisma } from '../config/db'

export const authMiddleware = async (req, res, next) => {
    let token
    const authHeader = req.headers.authorization

    if (authHeader && authHeader.startsWith("Bearer")) {
        token = authHeader.split(" ")[1]
    }

    if (!token) {
        return res.status(401).json({error: "Not authorized, no token provided"})
    }
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        const user = await prisma.user.findUnique({
            where: { id: decoded }
        })
        
        if (!user) {
            return res.status(401).json({error: "User no longer exists"})
        }

        req.userId = user.id

        next()
    } catch (err) {
        return res.status(401).json({ error: "Not authorized, token failed"})
    }
}