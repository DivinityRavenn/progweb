import jwt from 'jsonwebtoken';

export function requireAuth(req,res,next){
    const header=req.header['authorization'];
    if (!header){
        res.status(401)
    }
    const token=header.split(' ')[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: "Token invalide ou expiré" });
        }
        
        req.user = user; 
        next(); 
    });
}