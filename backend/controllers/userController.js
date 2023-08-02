const asyncHandler = require("../node_modules/express-async-handler")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const User = require("../models/userModel")

//@desc Register a user
//@route POST /users/register
//@access Public

const registerUser = asyncHandler(async (req, res) => {
    const {username, email, password} = req.body
    console.log(req.body);
    if(!username || !email || !password){
        res.status(400).json({message: "All fields are mandatory"});
        return;
    }
    const userAvailable = await User.findOne({email})
    if(userAvailable){
        res.status(400).json({message: "User already registered"});
        return;
    }
    //Hash password
    const hashedPassword = await bcrypt.hash(password, 10)
    console.log(hashedPassword)
    const user = await User.create({
        username,
        email,
        password: hashedPassword
    });
    if(user){
        res.status(201).json({_id: user.id, email: user.email, message: "User registered!"})
    }else{
        res.status(400).json({message: "Unexpected error, try again later"});
        return;
    }
});

//@desc login a user
//@route POST /users/login
//@access Public
 
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
  
    if (!email || !password) {
      res.status(400).json({ message: "All fields are mandatory" });
      return;
    }
  
    const user = await User.findOne({ email });
  
    if (user && (await bcrypt.compare(password, user.password))) {
      const accessToken = jwt.sign(
        {
          user: {
            username: user.username,
            email: user.email,
            id: user.id,
          },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "10m" }
      );
      res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: true,

      });
      res.status(200).json({accessToken, message: "User logged in!" });
    } else {
      res.status(401).json({ message: "Wrong username or password" });
    }
  });
  
//@desc current user info
//@route POST /users/current
//@access Public

const seeCurrentUserInfo = asyncHandler(async (req,res) => {
    res.json(req.user);
});

module.exports = {seeCurrentUserInfo, loginUser, registerUser}