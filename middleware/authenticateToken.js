import jwt from "jsonwebtoken"
export default function authentificateToken(req,res,next){
    const token = req.headers['authorization'];
    const bearerToken = token && token.split(' ')[1];//if exists return it else undefined
    if(!bearerToken){
        res.status(401).json({
            err:"no token passed"
        })
        return;
    }
    //verify the token
    jwt.verify(bearerToken, process.env.JWT_SECRET_KEY, (err, user) => {
        if(err){
            return res.status(403).json({
                err:"invalid token or expired"
            });
        }
        req.user = user;
        next();
    });
}