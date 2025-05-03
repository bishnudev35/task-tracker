import Router from 'express';
import jwt from 'jsonwebtoken';
const router = Router();

router.get('/valid', (req, res) => {
try {
    console.log(req.query.longTermToken);
    const  {longTermToken}  = req.query;
    if (!longTermToken) {
        return res.status(400).json({ message: 'longtermToken is required' });
    }
    const isValidToken = jwt.verify(longTermToken, process.env.JWT_SECRET);
   try {
        const decoded = jwt.verify(longTermToken, process.env.JWT_SECRET);
        console.log("Token is valid:", decoded);
       console.log("bal bichi")
        res.status(200).json({ message: 'Token is valid', decoded });

    
   } catch (error) {    
        console.error('Token verification error:', error);
        return res.status(401).json({ message: 'Invalid token' });
    }
    
   }
 catch (error) {
    console.error('Error during validation:', error);
    res.status(500).json({ message: 'Internal server error' });
    

} 
})
export default router;