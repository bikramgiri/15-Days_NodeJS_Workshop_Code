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
  const error = req.flash("error") 
  res.render("login", {error: error}) // Render the login page with any error messages from the flash session
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
    req.flash("success","Login successful") // Set a success message in the flash session
    res.redirect("/")
  }else{
    // return res.status(401).send("Invalid password") // If the password is invalid, return an error response
    req.flash("error","Invalid password") // Set an error message in the flash session
    res.redirect("/login") // Redirect to the login page
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
    const generateOtp = Math.floor(100000 + Math.random() * 900000) // Generate a random 6-digit OTP

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
      otp : generateOtp // Generate a random 6-digit OTP
    })

    // save the otp in the database
    emailExists[0].otp = generateOtp
    emailExists[0].otpGeneratedTime = Date.now()  // Set the OTP generated time to the current time
    await emailExists[0].save() // Save the updated user information to the database

    res.redirect("/verifyOtp?email=" + email) // Redirect to the verifyOtp page with the email as a query parameter
  }
}

exports.verifyOtp = (req,res)=>{
  const email = req.query.email // Get the email from the query parameter
  res.render("verifyOtp", {email : email}) // Render the verifyOtp page with the email as a parameter
}

exports.checkVerifyOtp = async (req,res)=>{
  const email = req.params.id // Get the email from the request parameters
  const otp = req.body.otp // Get the OTP from the request body

  if(!otp || !email){
    return res.send("Please provide email and OTP") // Check if both email and OTP are provided
  }

  const userData = await users.findAll({
    where : {
      email : email,
      otp : otp
    }
  })
  if(userData.length == 0){ // If the OTP does not match, return an error response
    return res.send("Invalid OTP")
  }else{
    const currentTime = Date.now() // Get the current time
    const otpGeneratedTime = userData[0].otpGeneratedTime // Get the OTP generated time from the database
    const timeDiff = currentTime - otpGeneratedTime // Calculate the time difference between the current time and the OTP generated time

    if(timeDiff > 2*60*1000){ // If the OTP is older than 2 minutes, return an error response
      return res.send("OTP was expired")
    }else{
      // userData[0].otp = null // Clear the OTP in the database
      // userData[0].otpGeneratedTime = null // Clear the OTP generated time in the database
      // await userData[0].save() // Save the updated user information to the database
      
      // res.redirect("/passwordChange?email=" + email) // Redirect to the passwordChange page with the email as a query parameter
      res.redirect(`/passwordChange?email=${email}&otp=${otp}`) // Redirect to the passwordChange page with the email and OTP as query parameters
    }
  }
}


exports.passwordChange = (req,res)=>{
  const email = req.query.email 
  const otp = req.query.otp
  if(!email || !otp){ // Check if both email and OTP are provided
    return res.send("Please provide email and OTP in the query parameters") // If not, return an error response
  }

  res.render("passwordChange", {email : email, otp : otp})
}

exports.checkPasswordChange = async (req,res)=>{
  const newPassword = req.body.newPassword // Get the new password from the request body
  const confirmNewPassword = req.body.confirmNewPassword // Get the confirm password from the request body
  const email = req.params.email // Get the email from the query parameter
  const otp = req.params.otp // Get the OTP from the query parameter
  if(!newPassword || !confirmNewPassword || !email || !otp ){ // Check if all required fields are provided
    return res.send("Please provide newPassowrd, confirmNewPassword, email and OTP") // If not, return an error response
  }

  // checking if that email otp or not
  const userData = await users.findAll({
    where : {
      email : email,
      otp : otp
    }
  })

  if(userData.length == 0){ // If the OTP does not match, return an error response
    return res.send("Donot try this, Invalid OTP")
  }else{
    const currentTime = Date.now() // Get the current time
    const otpGeneratedTime = userData[0].otpGeneratedTime // Get the OTP generated time from the database
    const timeDiff = currentTime - otpGeneratedTime // Calculate the time difference between the current time and the OTP generated time

    if(timeDiff > 3*60*1000){ // If the OTP is older than 2 minutes, return an error response
      // return res.send("Since OTP is expired, you dont able to change password") // If the OTP is expired, return an error response
      res.redirect("/forgotPassword") // Redirect to the forgot password page
    }else{
      // userData[0].otp = null // Clear the OTP in the database
      // userData[0].otpGeneratedTime = null // Clear the OTP generated time in the database
      // await userData[0].save() // Save the updated user information to the database
      
      if(newPassword !== confirmNewPassword){ // Check if the new password and confirm password match
            return res.send("newPassword and confirmNewPassword do not match") // If they do not match, return an error response
          }else{
            userData[0].password = bcrypt.hashSync(newPassword, 10) // Hash the new password and update it in the database
            await userData[0].save() // Save the updated user information to the database
            
            res.redirect("/login") // Redirect to the login page after password change
        }
    }
  }
  
// *OR

//   if(userData.length == 0){ // If the OTP does not match, return an error response
//     return res.send("Donot try this, Invalid OTP") // If the OTP is invalid, return an error response
//   }

//   if(newPassword !== confirmNewPassword){ // Check if the new password and confirm password match
//     return res.send("newPassword and confirmNewPassword do not match") // If they do not match, return an error response
//   }else{
//     userData[0].password = bcrypt.hashSync(newPassword, 10) // Hash the new password and update it in the database
//     await userData[0].save() // Save the updated user information to the database
    
//     res.redirect("/login") // Redirect to the login page after password change
// }

}


