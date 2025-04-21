const { blogs, sequelize, users } = require('../model/index')
const bcrypt = require('bcryptjs') 
const jwt = require('jsonwebtoken') 
const sendEmail = require('../services/sendEmail')

exports.registerPage = (req,res)=>{
      res.render("register")
}

exports.register = async(req,res)=>{
  const {username,email,password} = req.body
  
  if(!username || !email || !password){ // Check if all required fields are provided
    return res.status(400).send("All fields are required")
  }
  const existingUser = await users.findAll({
    where : {
      email : email // Check if the email already exists in the database
    }
  })
  
  if(existingUser.length > 0){ // If the email already exists, return an error response
    return res.status(409).send("Email already exists")
  }
  await users.create({
    username : username,
    email : email,
    password : bcrypt.hashSync(password, 10) // Hash the password using bcrypt with a salt rounds of 10
  })
  // res.send("User registered successfully")
  res.redirect("/login")
}

exports.loginPage = (req,res)=>{
      res.render("login")
}

exports.login = async(req,res)=>{
  const {email,password} = req.body

  // ser side validation
  // if(!email || !password){ // Check if all required fields are provided
  //   return res.status(400).send("All fields are required")
  // }

  const userExists = await users.findAll({
    where : {
      email : email
    }
  })
  // if(userExists.length == 0){ // Check if the user exists in the database
  //   return res.status(404).send("User not found")
  // }
  // const isValid = bcrypt.compareSync(password,userExists[0].password) // Compare the provided password with the hashed password in the database
  // if(!isValid){
  //   return res.status(401).send("Invalid password")
  // }
 
  // or
  
  if(userExists.length == 0){ // Check if the user exists in the database
    return res.send("User not found")
  }else{
    const userPassword = userExists[0].password // Get the hashed password from the database
    const isValid = bcrypt.compareSync(password,userPassword) // Compare the provided password with the hashed password in the database
  if(isValid){
    // Generate a JWT token for the user
    const token = jwt.sign({ id: userExists[0].id }, process.env.JWT_SECRETKEY, { expiresIn: '5d' }) // Create a JWT token with the user's ID and a secret key
    // res.cookie("token", token)
    // Or
    res.cookie("token", token, { // Set the token as a cookie in the response
      httpOnly: true, // Make the cookie HTTP-only to prevent client-side access
      secure: true, // Set the secure flag to true to ensure the cookie is sent over HTTPS
      // secure: process.env.NODE_ENV === 'production', // Set the secure flag for production environment
      maxAge: 5*24 * 60 * 60 * 1000 // Set the cookie expiration time to 5 days
    })

    // return res.status(200).send("Login successful") 
    res.redirect("/")
  }else{
    return res.status(401).send("Invalid password") // If the password is invalid, return an error response
  }
  }
   


  // if(userExists.length > 0 && bcrypt.compareSync(password,userExists[0].password)){ // If the user exists and the password is correct
  //   req.session.user = userExists[0] // Store the user information in the session
  //   res.send("Login successful")
  // }else{
  //   res.send("Login failed")
  // }

  // res.redirect("/")
}

exports.logout = (req,res)=>{
  res.clearCookie("token") // Clear the token cookie from the response
  res.redirect("/login") // Redirect to the login page after logout
}

// forgot Password
exports.forgotPassword = (req,res)=>{
  res.render("forgotPassword")
}

exports.checkForgotPassword = async (req,res)=>{
  const email = req.body.email
  if(!email){
    return res.send("Please provide email")
  }
  
  // *for all email: tyo email ma otp pathaunae
  const allUsers = await users.findAll() // Get all users from the database

  // if email -> users table check with that email exists or not
  const emailExists = await users.findAll({
    where : {
      email : email
    }
  })
  if(emailExists.length == 0){ // If the email does not exist, return an error response
    return res.send("Email not found")
  }else{

    // // *for all email: tyo email ma otp pathaunae
    // for(let i = 0; i < allUsers.length; i++){
    //   await sendEmail({
    //     email : allUsers[i].email,
    //     subject : "OTP for password reset",
    //     otp : Math.floor(100000 + Math.random() * 900000) // Generate a random 6-digit OTP
    //   })
    // }

    // *for one email: tyo email ma otp pathaunae
    await sendEmail({
      email : email,
      subject : "OTP for password reset",
      otp : Math.floor(100000 + Math.random() * 900000) // Generate a random 6-digit OTP
    })

    res.send("OTP sent to your email") 
  }
}




