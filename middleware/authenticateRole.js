import "dotenv/config"


export default function checkRoles(listRoles){
    return (req,res,next)=>{
        const role = req.user.role
        if(!listRoles.includes(role)){
            return res.status(403).json({
                err:"not sufficient permissions"
            })
        }
        next();
    }
}