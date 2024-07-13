import jwt from 'jsonwebtoken';

export const sendCookie = (user,res,message,statusCode=200)=>{
    const token = jwt.sign({ _id: user._id}, process.env.SECRET_CODE);
    res.status(statusCode).cookie("Token",token,{ maxAge: 7 * 24 * 60 * 60 * 1000, httpOnly: true ,secure: true,sameSite: 'none'}).json({succes:true,message})
}
