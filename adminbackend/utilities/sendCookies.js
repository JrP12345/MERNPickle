import jwt from 'jsonwebtoken';

export const sendCookie = (user,res,message,statusCode=200)=>{
    const token = jwt.sign({ _id: user._id}, process.env.SECRET_CODE);
    res.status(statusCode).cookie("Token",token,{maxAge:60*60*1000}).json({succes:true,message})
}
