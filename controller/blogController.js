const { blogs, sequelize, users } = require('../model/index')  // sequelize, blogs, users are imported from model/index.js file
const fs = require('fs') // File system module to delete files
const bcrypt = require('bcryptjs') 

// *Raw Queries using sequelize
// const db = require('../model/index') // Import the database connection and models
// const sequelize = db.sequelize // Get the sequelize instance from the db object
// OR
// require, sequelize in first line


// exports.homePage = async(req,res)=>{ 
//   const datas = await blogs.findAll() // blogs return on array of objects
//     res.render("home", { blogs : datas }) 
// }

exports.homePage = async (req, res) => {
  const success = req.flash('success'); 
  try {
      const datas = await blogs.findAll({
        include : 
          { 
            model: users, // Include the users model
            as: 'user' // Include the users model
        } 
      });

    // **OR (Raw Queries using sequelize)
    // const datas = await sequelize.query("SELECT * FROM blogs", { // Raw SQL query to join blogs and users tables
    //   type: sequelize.QueryTypes.SELECT // Specify the query type as SELECT
    // });

      res.render('home', { blogs: datas, success: success }); // Pass the blogs data to the home view
  } catch (error) {
      console.error('Error in homePage:', error);
      res.status(500).send('Internal Server Error');
  }
};

// exports.singleBlog = async(req,res)=>{
//   const id = req.params.id 
//   const blog = await blogs.findByPk(id) // Find a blog by its primary key (id) and findByPk returns object
//     res.render("singleBlog",{blog : blog})
// }

exports.singleBlog = async (req, res) => {
  try {
      const id = req.params.id;
      const blog = await blogs.findByPk(id, {
          include:
              {
                  model: users,
                  as: 'user'
              }
      });

      // **OR (Raw Queries using sequelize)
      // const blog = await sequelize.query("SELECT * FROM blogs JOIN users ON blogs.id = users.id WHERE blogs.id = ?", {
      //     replacements: [id], // Replace the placeholder with the actual id value
      //     type: sequelize.QueryTypes.SELECT // Specify the query type as SELECT
      // });


      if (!blog) return res.status(404).send('Blog not found');
      res.render('singleBlog', { 
        blog: blog,
        user: req.user ? req.user[0] : null // Pass the authenticated user (or null if not logged in) 
    });
  } catch (error) {
      console.error('Error in singleBlog:', error);
      res.status(500).send('Internal Server Error');
  }
};

// exports.deleteBlog = async(req,res)=>{
//   const id = req.params.id 
//   await blogs.destroy({
//     where : {
//       id : id
//     }
//   })
//   res.redirect("/")
// }

exports.deleteBlog = async (req, res) => {
  try {
      const id = req.params.id;
      const blog = await blogs.findByPk(id);
    if (!blog) {
      return res.status(404).send('Blog not found');
    }
    // Check if the authenticated user is the owner of the blog
    if (blog.userId !== req.user[0].id) {
      return res.status(403).send('You are not authorized to delete this blog');
    }
      await blogs.destroy({ where: { id: id } });

      // *Delete image when delete button is clicked
      const oldImagePath = blog.image;
      // console.log(oldImagePath)  // http://localhost:3000/1745145111359-Email Trick.jpg
      const lengthOfUnwanted = 'http://localhost:3000/'.length;
      // console.log(lengthOfUnwanted)
      const fileNameInStorageFolder = oldImagePath.slice(lengthOfUnwanted);
      console.log(fileNameInStorageFolder); // 1745145111359-Email Trick.jpg
      fs.unlink('storage/' + fileNameInStorageFolder, (err) => {
          if (err) {
              console.error('Error deleting image:', err);
          } else {
              console.log('Image deleted successfully');
          }
        });

      res.redirect('/');
  } catch (error) {
      console.error('Error in deleteBlog:', error);
      res.status(500).send('Internal Server Error');
  }
};

// exports.editBlog = async(req,res)=>{ // Define a route for the /update/:id URL
//   const id = req.params.id // Get the id from the request parameters
//   const blog = await blogs.findByPk(id) // Find a blog by its primary key (id)
//   if (!blog) {
//     return res.status(404).send("Blog not found");
// }
//   res.render("editBlog",{blog : blog}) // Render the update view and pass the blog data to it
// }

exports.editBlog = async (req, res) => {
  try {
      const id = req.params.id;
      const blog = await blogs.findByPk(id);
      if (!blog){
        return res.status(404).send('Blog not found');
      } 
    //   // Check if the authenticated user is the owner of the blog
    // if (blog.userId !== req.user[0].id) {
    //     return res.status(403).send('You are not authorized to edit this blog');
    //   }
      res.render('editBlog', { blog: blog });
  } catch (error) {
      console.error('Error in editBlog:', error);
      res.status(500).send('Internal Server Error');
  }
};

// exports.updateBlog = async(req,res)=>{ // Define a route for the /update/:id URL with the POST method
//   const id = req.params.id // Get the id from the request parameters
//   const {title,subtitle,description} = req.body // Destructure the title, subtitle, and description from the request body 
//   const update = {
//     title : title,
//     subtitle : subtitle,
//     description : description// Get the filename of the uploaded image from the request file object
//   }
//   if (req.file) {
//     update.image = req.file.filename; // Only update image if a new one is uploaded
// }
// await blogs.update(update, {
//     where: { id: id }
// });
// res.redirect(`/blog/${id}`); // Redirect to single blog page
// }

exports.updateBlog = async (req, res) => {
  try {
      const id = req.params.id;
      const blog = await blogs.findByPk(id); 
    if (!blog) {
      return res.status(404).send('Blog not found');
    }

    // Check new image is uploaded or not
    const oldDatas = await blogs.findAll({
      where: { id: id }
    })
    let fileUrl;
    if(req.file) {
      fileUrl = process.env.PROJECT_URL + req.file.filename; // Use the new image URL if uploaded

            // *Delete the old image file if a new one is uploaded
            const oldImagePath = oldDatas[0].image 
            // console.log(oldImagePath)  // http://localhost:3000/1745145111359-Email Trick.jpg
            const lengthOfUnwanted = "http://localhost:3000/".length
            // console.log(lengthOfUnwanted) 
            const fileNameInStorageFolder = oldImagePath.slice(lengthOfUnwanted)
            console.log(fileNameInStorageFolder) // 1745145111359-Email Trick.jpg
      
            fs.unlink("storage/" + fileNameInStorageFolder, (err) => {
                if(err){
                  console.error('Error deleting image:', err);
                }else{
                  console.log('Image deleted successfully');
                }
            });

    }else{
      fileUrl = oldDatas[0].image 
    }

    // // Check if the authenticated user is the owner of the blog
    // if (blog.userId !== req.user[0].id) {
    //   return res.status(403).send('You are not authorized to update this blog');
    // }
      const { title, subtitle, description } = req.body;
      const update = {
          title: title,
          subtitle: subtitle,
          description: description,
          image: fileUrl
      };
      // if (req.file) {
      //     update.image = req.file.filename;
      // }
      await blogs.update(update, { where: { id: id } });

      res.redirect(`/blog/${id}`);
  } catch (error) {
      console.error('Error in updateBlog:', error);
      res.status(500).send('Internal Server Error');
  }
};

// exports.createBlogPage = (req,res)=>{ // Define a route for the /create URL
//       res.render("create") // send a response when the /create route is accessed with the GET method
//   }

exports.createBlogPage = (req, res) => { 
  try {
      res.render('create');
  } catch (error) {
      console.error('Error in createBlogPage:', error);
      res.status(500).send('Internal Server Error');
  }
};

// exports.createBlog = async(req,res)=>{ // Define a route for the /create URL with the POST method
//   // const title = req.body.title // Get the title from the request body
//   // const subtitle = req.body.subtitle // Get the subtitle from the request body
//   // const description = req.body.description // Get the description from the request body
//   // const image = req.file.filename // Get the filename of the uploaded image from the request file object
//   // OR
//   const {title,subtitle,description} = req.body // Destructure the title, subtitle, and description from the request body 
//   await blogs.create({
//     title : title,
//     subtitle : subtitle,
//     description : description,
//     image : req.file.filename // Get the filename of the uploaded image from the request file object
//   })
// //   res.send("Blog added successfully")
//   res.redirect("/") // Redirect to the home page after creating the blog
// }

exports.createBlog = async (req, res) => {
    // console.log(req.user[0].id, "userID from createBlog")
    const userId = req.user[0].id; // Get the user ID from the request object
    // or
    // const userId = req.userId // Get the user ID from the request object
  try {
      const { title, subtitle, description } = req.body;
      const image = req.file.filename; 

      //ser side validation
      if (!title || !subtitle || !description || !image) {
          return res.send('All fields are required');
      }

      await blogs.create({
          title: title,
          subtitle: subtitle,
          description: description,
          image: process.env.PROJECT_URL + image,
          userId: userId // Associate the blog with the user ID
      });

      
      // **OR
      // **Raw Queries using sequelize to make separate blog table for each user
      // await sequelize.query(`CREATE TABLE IF NOT EXISTS blog_${userId} (
      //     id INT PRIMARY KEY AUTO_INCREMENT,
      //     title VARCHAR(255) NOT NULL,
      //     subtitle VARCHAR(255) NOT NULL,
      //     description TEXT NOT NULL,
      //     image VARCHAR(255) NOT NULL,
      //     userId INT NOT NULL,
      //     FOREIGN KEY (userId) REFERENCES users(id)
      // )`, { type: sequelize.QueryTypes.CREATE }); // Create the blogs table if it doesn't exist

      // await sequelize.query(`INSERT INTO blog_${userId} (title, subtitle, description, image, userId) VALUES (?, ?, ?, ?, ?)`, {
      //     replacements: [title, subtitle, description, process.env.PROJECT_URL + image, userId], // Replace the placeholders with actual values
      //     type: sequelize.QueryTypes.INSERT // Specify the query type as INSERT
      // });


      res.redirect('/');
  } catch (error) {
      console.error('Error in createBlog:', error);
      res.status(500).send('Internal Server Error');
  }
};

exports.myBlogPage = async(req, res) => {
  try {
    // get this users blogs only
const userId = req.userId;
// find blogs of this userId
const myBlogs = await blogs.findAll({
    where: {
        userId: userId
    }
})
res.render("myBlogs.ejs",{myBlogs : myBlogs})
  } catch {
      console.error('Error in myBlogPage:', error);
      res.status(500).send('Internal Server Error');
  }
}

