import jwt from 'jsonwebtoken';
import prisma from '../lib/db.js'; // Add .js if using ESModules
import JwtSign from '../util/jwt.js';

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const longTermToken = req.headers['longtermtoken'];

  if (!authHeader) {
    return res.status(401).json({ message: 'No token provided' });
  }
  if (!longTermToken) {
    return res.status(401).json({ message: 'No long-term token provided' });
  }
  
  const token = authHeader;
  console.log("token", token);
  console.log("longTermToken", longTermToken);
  console.log("secret", process.env.JWT_SECRET);
  
  try {
   
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Regular token is valid");
      
     
      req.body.user = decoded;
      return next();
    } catch (tokenError) {
      console.log("Regular token verification failed, trying long-term token");
      
     
      try {
        const longDecoded = jwt.verify(longTermToken, process.env.JWT_SECRET);
        const { email } = longDecoded;
        console.log("Long-term token is valid, email:", email);
       
        const user = await prisma.user.findUnique({
          where: { 
          
           email
          },
        });
        
        if (!user) {
          return res.status(401).json({ message: 'User not found' });
        }
        
        // Generate a new token
        const newToken = JwtSign(user, process.env.JWT_SECRET);
        
        // Update the request header with the new token
        req.headers['authorization'] = newToken;
        
        // Attach user info to the request body
        req.body.user = user;
        
        return next();
      } catch (longTokenError) {
        return res.status(401).json({ message: 'Invalid long-term token', longTokenError });
      }
    }
  } catch (err) {
    console.error('Authentication error:', err);
    return res.status(401).json({ message: 'Authentication failed' });
  }
};

export default authMiddleware;