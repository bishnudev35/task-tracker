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
  
  
  try {
   
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
     
      req.body.user = decoded;
      return next();
    } catch (tokenError) {
  
      
     
      try {
        console.log(process.env.JWT_SECRET)
        console.log(longTermToken)
        const longDecoded = jwt.verify(longTermToken, process.env.JWT_SECRET);
        console.log("decoded",longDecoded)
        const { email } = longDecoded;
       
       
        const user = await prisma.user.findUnique({
          where: { 
          
           email
          },
        });
        console.log(user)
        if (!user) {
          return res.status(401).json({ message: 'User not found' });
        }
        
        // Generate a new token
        const newToken = JwtSign(user, process.env.JWT_SECRET);
        console.log("new",newToken)
        // Update the request header with the new token
        req.headers['authorization'] = newToken;
        
        if(req.body){
          req.body.user = user; // Attach user info to the request body

        }else{
          req.user = user
        }
        return next();
      } catch (longTokenError) {
        return res.status(401).json({ message: 'Invalid long-term token', longTokenError });
      }
    }
  } catch (err) {
    console.log(err)
    return res.status(401).json({ message: 'Authentication failed' });
  }
};

export default authMiddleware;