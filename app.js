// const app = require('express')()
const express = require('express')
const app = express()

app.set('view engine','ejs') // Set the view engine to ejs
require("./model/index") // Import the database connection and models from the index.js file in the model folder

// app.get('/',(request,response)=>{
//     res.send("Hello World")
// })
// OR
// app.get('/',(Hello,hi)=>{  // Hello = request, Hi = response
//       res.send("Hello World")
//   })
  // OR

app.get('/',(req,res)=>{  // Req means the request and res means the response
//     res.send("Hello World")
      //  res.render("home.ejs")
       //Or
      //  res.render("home") // This will look for home.ejs file in the views folder

      const data = {
        name: "John Doe",
        age: 25,
        city: "New York"
      } 
      const nepal = {
        name: "Nepal",
        capital: "Kathmandu",
        population: 21 // in millions
      }
      res.render("home.ejs",{
        info: data,
        info2: nepal
      }) 
      // OR
      // res.render("home",{name:"John",age:25,city:"New York"}) // This will look for home.ejs file in the views folder
})

app.get('/about',(req,res)=>{ 
    // res.render("test/about.ejs") 
    // Or
    res.render("test/about") // This will look for test/about.ejs file in the views folder
})


app.use(express.static('public/css'))  // It means that the css folder is in the public folder and it will look for the css file in the public folder

app.listen(3000,()=>{
      console.log("Server is running on port 3000")
})







