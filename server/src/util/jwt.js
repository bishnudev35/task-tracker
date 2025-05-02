import jwt from 'jsonwebtoken';

const  JwtSign=(payload, secret) => {
    const {id,name,email,country}=payload;
    const token = jwt.sign({id, name, email, country }, secret, { expiresIn: '1h' });
    return token;
}
const jwtLongSign=(email, secret) => {
   
    const longTermToken = jwt.sign({email}, secret, { expiresIn: '15d' });
    return longTermToken;
}
export default JwtSign;
export {jwtLongSign};