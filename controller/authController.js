const { blogs, sequelize, users } = require('../model/index')
const bcrypt = require('bcryptjs') 

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
  const userExists = await users.findAll({
    where : {
      email : email
    }
  })
  if(userExists.length == 0){ // Check if the user exists in the database
    return res.status(404).send("User not found")
  }
  const isValid = bcrypt.compareSync(password,userExists[0].password) // Compare the provided password with the hashed password in the database
  if(!isValid){
    return res.status(401).send("Invalid password")
  }
 
  // or

  // if(userExists.length > 0 && bcrypt.compareSync(password,userExists[0].password)){ // If the user exists and the password is correct
  //   req.session.user = userExists[0] // Store the user information in the session
  //   res.send("Login successful")
  // }else{
  //   res.send("Login failed")
  // }

  res.redirect("/")
}
