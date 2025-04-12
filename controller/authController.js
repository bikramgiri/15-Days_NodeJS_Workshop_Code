const { blogs, sequelize, users } = require('../model/index')
const bcrypt = require('bcryptjs') 

exports.registerPage = (req,res)=>{
      res.render("register")
}

exports.register = async(req,res)=>{
  const {username,email,password} = req.body
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
  const user = await users.findAll({
    where : {
      email : email
    }
  })
  if(user.length == 0){ // Check if the user exists in the database
    return res.status(404).send("User not found")
  }
  const isValid = bcrypt.compareSync(password,user[0].password) // Compare the provided password with the hashed password in the database
  if(!isValid){
    return res.status(401).send("Invalid password")
  }
  res.redirect("/")
}
