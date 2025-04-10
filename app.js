require('dotenv').config() // Load environment variables from a .env file into process.env
// const app = require('express')() // Import the express module and create an instance of it
const express = require('express') // Import the express module
const { blogs, sequelize, users } = require('./model/index')
// const multer = require('./middleware/multerConfig').multer 
// const storage = require('./middleware/multerConfig').storage
// Or
const {multer,storage} = require('./middleware/multerConfig') 
const upload = multer({storage: storage}) 
const bcrypt = require('bcrypt') // Import the bcrypt module for password hashing

const app = express() // Create an instance of express

app.set('view engine','ejs') // Set the view engine to ejs
require("./model/index") // Import the database connection and models from the index.js file in the model folder
// app.use(express.json()) // Middleware to parse JSON data in request bodies,  frontend and backend are different servers
app.use(express.urlencoded({extended:true})) // Middleware to parse URL-encoded data (form submissions), frontend and backend are same server

app.get("/",async(req,res)=>{ 
  const datas = await blogs.findAll() // blogs return on array of objects
    res.render("home", { 
      blogs : datas 
    }) 
}
)

app.get("/blog/:id",async(req,res)=>{
  const id = req.params.id 
  const blog = await blogs.findByPk(id) // Find a blog by its primary key (id) and findByPk returns object
    res.render("singleBlog",{blog : blog})
})

app.get("/delete/:id",async(req,res)=>{
  const id = req.params.id 
  await blogs.destroy({
    where : {
      id : id
    }
  })
  res.redirect("/")
})

app.get("/edit/:id",async(req,res)=>{ // Define a route for the /update/:id URL
  const id = req.params.id // Get the id from the request parameters
  const blog = await blogs.findByPk(id) // Find a blog by its primary key (id)
  if (!blog) {
    return res.status(404).send("Blog not found");
}
  res.render("editBlog",{blog : blog}) // Render the update view and pass the blog data to it
})

app.post("/update/:id",upload.single('image'),async(req,res)=>{ // Define a route for the /update/:id URL with the POST method
  const id = req.params.id // Get the id from the request parameters
  const {title,subtitle,description} = req.body // Destructure the title, subtitle, and description from the request body 
  const update = {
    title : title,
    subtitle : subtitle,
    description : description// Get the filename of the uploaded image from the request file object
  }
  if (req.file) {
    update.image = req.file.filename; // Only update image if a new one is uploaded
}
await blogs.update(update, {
    where: { id: id }
});
res.redirect(`/blog/${id}`); // Redirect to single blog page
})


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
  res.send("Blog added successfully")

})

app.get("/register",(req,res)=>{
  res.render("register")
})

app.post("/register",async(req,res)=>{
  const {username,email,password} = req.body
  await users.create({
    username : username,
    email : email,
    password : bcrypt.hashSync(password, 10) // Hash the password using bcrypt with a salt rounds of 10
  })
  // res.send("User registered successfully")
  res.redirect("/login")
})

app.use(express.static('public/css')) 
app.use(express.static("./storage"))

app.listen(3000,()=>{ // Start the server and listen on port 3000
      console.log("Server is running on port 3000") // Log a message to the console when the server is running
})







