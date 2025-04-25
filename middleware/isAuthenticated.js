// *Useful in all project

const jwt = require("jsonwebtoken")
// const promisify = require("util").promisify 
// or
const {promisify} = require("util");
const { users } = require("../model");
// const { decode } = require("punycode");
const { decodeToken } = require("../services/decodeToken");

exports.isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies.token; // Get the token from the cookies
  
    // Check if the token is provided or not in the request
    if (!token) {
      // return res.send("You must be logged In"); // If no token is found, return an error response
      // or
      return res.redirect("/login") // Redirect to the login page
    }
    // Verify the token using the secret key and check if it is valid
    // Promisify handle call back function to avoid callback hell 
    const decryptedResult = await decodeToken(token, process.env.JWT_SECRETKEY) // Decode the token using the secret key
   //   console.log(decryptedResult)
    
    // check if that id(userID) users table ma exists xa ki nai
    const userExist = await users.findAll({
      where: {
        id: decryptedResult.id // Check if the user ID exists in the database
      }
    })
    if (userExist.length == 0) { // If the user ID is not found in the database
        // res.send("User with that token does not exist"); // Return an error response
        // or
        return res.redirect("/login") // Redirect to the login page
    }else{
        req.user = userExist// Set the user ID in the request object for further use
        // or
        req.userId = userExist[0].id // Set the user ID in the request object for further use
        // or
        // req.user.id = decryptedResult.id
  
        next();
    }
  } catch (error) {
    console.error("Error in isAuthenticated middleware:", error); // Log the error for debugging
    res.status(500).send("Internal Server Error"); // Return a 500 status code for internal server error
    // res.send("Invalid token"); // Return an error response for invalid token
    // or
    // return res.redirect("/login") // Redirect to the login page
  }
}
