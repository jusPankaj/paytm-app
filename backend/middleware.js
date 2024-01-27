const jwt = require("jsonwebtoken")
const { JWT_SECRET } = require("./config");

const authMiddleware = (req, res, next) => {
    authHeader = req.headers.authorization;
    
    if(!authHeaders || !authHeaders.startsWith("Bearer ")){
        res.status(403).json({

        })
    }

    const token = authHeader.split(' ')[1];

    try{
        const decoded = jwt.verify(token, JWT_SECRET)
        if(decoded.userId){
            req.userId = decoded.userId
            next();
        }
        else{
            res.status(403).json({})
        }
    }catch{
        res.status(403).json({})
    }
}
    module.exports = {
        authMiddleware
    }