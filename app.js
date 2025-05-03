require('dotenv').config() // Load environment variables from a .env file into process.env
// const app = require('express')() // Import the express module and create an instance of it
const express = require('express') // Import the express module
const { blogs, sequelize, users } = require('./model/index')

// const multer = require('./middleware/multerConfig').multer 
// const storage = require('./middleware/multerConfig').storage
// Or
const {multer,storage} = require('./middleware/multerConfig') 
const upload = multer({storage: storage}) 
const bcrypt = require('bcryptjs') // Import the bcrypt module for password hashing
const { homePage, singleBlog, deleteBlog, editBlog, updateBlog, createBlogPage, createBlog } = require('./controller/blogController')
const { login, loginPage, register, registerPage } = require('./controller/authController')

const app = express() // Create an instance of express
const cookieParser = require('cookie-parser') // Import the cookie-parser module for parsing cookies

// **Websecurity
const sanitizeHtml = require('sanitize-html') // Import the sanitize-html module for sanitizing HTML input
const rateLimit = require('express-rate-limit') // Import the express-rate-limit module for rate limiting
const helmet = require('helmet') // Import the helmet module for securing HTTP headers

app.use(helmet()) // Use helmet middleware to secure HTTP headers

//**equire express-session and connect-flash for flash messages
const session = require('express-session')
const flash = require('connect-flash')

// **Websecurity Test
// const result = sanitizeHtml("<strong>Hello World!</strong>")
// console.log(result) // Output: <p>Hello World!</p> (sanitized HTML)

// Routes for handling different endpoints
const blogRoute = require("./routes/blogRoute")
const authRoute = require("./routes/authRoute") 
const { decode } = require('jsonwebtoken')
const { decodeToken } = require("./services/decodeToken")


app.set('view engine','ejs') // Set the view engine to ejs
require("./model/index") // Import the database connection and models from the index.js file in the model folder


// **Websecurity 
const rateLimiter = rateLimit({ // Middleware for rate limiting
      windowMs: 2 * 60 * 1000, // 2 minutes
      max: 2, // Limit each IP to 2 requests per windowMs
      standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
      legacyHeaders: false, // Disable the `X-RateLimit-*` headers
      message: "Too many requests, please try again later."
})

// **OR
// app.use(rateLimit({ // Middleware for rate limiting
//       windowMs: 15 * 60 * 1000, // 15 minutes
//       max: 100, // Limit each IP to 100 requests per windowMs
//       standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
//       legacyHeaders: false, // Disable the `X-RateLimit-*` headers
//       message: "Too many requests, please try again later."
// }))

app.use("/forgotPassword",rateLimiter) // Use the rate limiter middleware to all requests


app.use(session({ // Middleware for session management
      secret: process.env.SESSION_SECRET, // Secret key for signing the session ID cookie
      resave: false, // Don't save session if unmodified
      saveUninitialized: false, // Don't create session until something stored
}))

app.use(flash()) // Middleware for flash messages

app.use(cookieParser()) // Middleware to parse cookies in the request
app.use(express.json()) // Middleware to parse JSON data in request bodies,  frontend and backend are different servers
app.use(express.urlencoded({extended:true})) // Middleware to parse URL-encoded data (form submissions), frontend and backend are same server

// app.get("/",homePage)

// app.get("/blog/:id",singleBlog)

// app.get("/delete/:id",deleteBlog)

// app.get("/edit/:id",editBlog)

// app.post("/update/:id",upload.single('image'),updateBlog)

// app.get("/create",createBlogPage)

// app.post("/create",upload.single('image'),createBlog )

// app.get("/register",registerPage)

// app.post("/register",register)

// app.get("/login",loginPage)

// app.post("/login",login)


// Or

// http://localhost:3000/ + /
// http://localhost:3000/ + /blog/:id
// http://localhost:3000/ + /delete/:id
// http://localhost:3000/ + /edit/:id
// http://localhost:3000/ + /update/:id
// http://localhost:3000/ + /create
// http://localhost:3000/ + /register
// http://localhost:3000/ + /login

app.use(async(req, res, next) => { // Middleware to log the request method and URL
      res.locals.currentUser = req.cookies.token // Set the current user in the response locals for use in views
      const token = req.cookies.token // Get the token from the cookies
      if (token) {
              try {
                    const decryptedResult = await decodeToken(token, process.env.JWT_SECRETKEY) // Decode the token using the secret key
                    if (decryptedResult && decryptedResult.id) {
                        res.locals.currentUserId = decryptedResult.id // Set the current user ID in the response locals
                    }
              } catch (err) {
                    console.error('Token verification error:', err) // Log any errors that occur during token verification
              }
        }
      next(); // Call the next middleware or route handler in the stack
  });                    

app.use('/',blogRoute) // Use the blogRoute for handling blog-related routes
app.use('/',authRoute) // Use the authRoute for handling authentication-related routes

app.use(express.static('public/css')) 
app.use(express.static("./storage"))

// Error handling middleware
app.use((err, req, res, next) => {
      console.error(err.stack);
      res.status(500).send('Something went wrong!');
  });

  //* localhost
app.listen(3000,()=>{ // Start the server and listen on port 3000
      console.log("Server is running on port 3000") // Log a message to the console when the server is running
})

//* production:
// Start server only if database connects
// sequelize.authenticate()
//     .then(() => {
//         console.log('Database connection established');
//         const port = process.env.PORT || 3000;
//         app.listen(port, () => {
//             console.log('Server is running on port 3000');
//         });
//     })
//     .catch(err => {
//         console.error('Unable to connect to the database:', err);
//         process.exit(1);
//     });







