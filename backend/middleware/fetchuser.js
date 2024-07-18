var jwt = require("jsonwebtoken");
const JWT_SEC = "sharkysignedthis";

const fetchuser = (req,res,next)=>{
    //next is used to call the next function , i.e 3rd argument on post req in auth.js

    //Get the userId from the jwt token and add id to the req object
    const token = req.header("auth-token");
    if(!token){
        return res.status(401).send({error:"Please authenticate using a valid token"});
    }
    try {
        const data = jwt.verify(token,JWT_SEC);
        req.user = data.user;
        next();
    } 
    catch (error) {
        console.error(error.message);        
        return res.status(401).send({error:"Please authenticate using a valid token"});

    }

}
module.exports = fetchuser;