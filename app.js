// const app = require('express')()
const express = require('express')
const app = express()


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
       res.send("<h1>Hello World!</h1>")
})

app.get('/about',(req,res)=>{ 
    res.send("This is the About Page")
})


app.listen(3000,()=>{
      console.log("Server is running on port 3000")
})







