require('dotenv').config() // Load environment variables from a .env file into process.env
// const app = require('express')() // Import the express module and create an instance of it
const express = require('express') // Import the express module
const { blogs, sequelize } = require('./model/index')
// const multer = require('./middleware/multerConfig').multer 
// const storage = require('./middleware/multerConfig').storage
// Or
const {multer,storage} = require('./middleware/multerConfig') 
const upload = multer({storage: storage}) 

const app = express() // Create an instance of express

app.set('view engine','ejs') // Set the view engine to ejs
require("./model/index") // Import the database connection and models from the index.js file in the model folder
// app.use(express.json()) // Middleware to parse JSON data in request bodies,  frontend and backend are different servers
app.use(express.urlencoded({extended:true})) // Middleware to parse URL-encoded data (form submissions), frontend and backend are same server

app.get("/",async(req,res)=>{ 
  const datas = await blogs.findAll()
    res.render("home", { 
      blogs : datas 
    }) 
}
)

app.get("/create",(req,res)=>{ // Define a route for the /create URL
    res.render("create") // send a response when the /create route is accessed with the GET method
})

app.post("/create",upload.single('image'), async(req,res)=>{ // Define a route for the /create URL with the POST method
  // const title = req.body.title // Get the title from the request body
  // const subtitle = req.body.subtitle // Get the subtitle from the request body
  // const description = req.body.description // Get the description from the request body
  // const image = req.file.filename // Get the filename of the uploaded image from the request file object
  // OR
  const {title,subtitle,description} = req.body // Destructure the title, subtitle, and description from the request body 
  await blogs.create({
    title : title,
    subtitle : subtitle,
    description : description,
    image : req.file.filename // Get the filename of the uploaded image from the request file object
  })
  res.send("Blod added successfully")

})

app.use(express.static('public/css'))  // It means that the css folder is in the public folder and it will look for the css file in the public folder

app.listen(3000,()=>{ // Start the server and listen on port 3000
      console.log("Server is running on port 3000") // Log a message to the console when the server is running
})







