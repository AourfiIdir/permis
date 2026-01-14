export default function authentificateToken(req,res,next){
    const token = req.headers['authorization'];
    const bearerToken = token && token.split(' ')[1];//if exists return it else undefined
    if(!bearerToken){
        res.status(401).json({
            err:"non token passed"
        })
        return;
    }
    //verify the token
    const verified = jwt.verify(bearerToken,process.env.JWT_SECRET_KEY,(err,user)=>{
        if(err){
            res.status(400).json({
                err:"dont have access"
            }
        )
        return;
        }
        req.user = user;
        next();

    })
}