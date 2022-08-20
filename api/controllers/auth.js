import User from "../models/User.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { createError } from "../utils/error.js"
export const register = async(req,res,next) => {
    try{
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.password, salt)
        //Encrypting password
        const newUser = new User({
            username: req.body.username,
            email:req.body.email,
            password: hash,
        })
        await newUser.save()
        res.status(200).send("USER has been created")
    }
    catch(err){
        next(err)
    }
}

export const login = async(req,res,next) => {
    try{
       const user = await User.findOne({username: req.body.username})
       if(!user) return next(createError(404,"User not found"))

       const isPasswordCorrect = await bcrypt.compare(req.body.password, user.password)
       if(!isPasswordCorrect) return next(createError(400,"Wrong password or username!"))

      // Authentication: This is the most common scenario for using JWT. 
      // Once the user is logged in, each subsequent request will include the JWT, allowing the user to access routes, services, and resources that are permitted with that token. 

       //JWT TOKEN to transfer specific information
       const token = jwt.sign({id: user._id, isAdmin: user.isAdmin}, process.env.JWT)
       const {password, isAdmin, ...otherDetails} = user._doc;
       //Token contains data
       //Token stored/ sent in cookie
       //sends it in cookie which is stored in browser
       res.cookie("access_token", token, {httpOnly: true}).status(200).json({...otherDetails});
    }
    catch(err){
        next(err)
    }
}

