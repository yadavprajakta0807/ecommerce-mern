import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

//signup User
export const signupUser = async(req,res)=>{
    try{
  const{ name,email,password } =req.body;

  //check if user already exist
  const userExists = await User.findOne({email});
    if(userExists){
        return res.status(400).json({ message :"User Already exists"});
    }
    //Hash password
    const hashPassword = await bcrypt.hash(password,10);

    //create user
    await User.create({
        name,
        email,
        password : hashPassword
    });
    res.json({message :"User registered successfully"});
    }catch(error){
     res.status(500).json({message:"Server error",error});
    }
};

//Login User
export const loginUser = async(req,res) =>{
try{
   const { email , password} =req.body;
   //check if user already exist
  const user = await User.findOne({email});
    if(!user){
        return res.status(400).json({ message :"User not found"});
    }
    //Compare pasword
    const match = await bcrypt.compare(password,user.password);
    if(!match){
        return res.status(400).json({message:"Invalid credentials"});
    }
    //Generate JWT Token
    const token = jwt.sign(
        {id:user._id},
        process.env.JWT_SECRET,
        {expiresIn:"7d"}
    );
    res.json({
        message:"Login Successfully",
        token,
        user:{
            id:user._id,
            name:user.name,
            email:user.email
        }
    });
}catch(error){
    res.status(500).json({message:"Server error",error});
}
};
