const { blogs, sequelize, users } = require('../model/index')
const bcrypt = require('bcryptjs') 

// exports.homePage = async(req,res)=>{ 
//   const datas = await blogs.findAll() // blogs return on array of objects
//     res.render("home", { blogs : datas }) 
// }

exports.homePage = async (req, res) => {
  try {
      const datas = await blogs.findAll();
      res.render('home', { blogs: datas });
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
      const blog = await blogs.findByPk(id);
      if (!blog) return res.status(404).send('Blog not found');
      res.render('singleBlog', { blog: blog });
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
      await blogs.destroy({ where: { id: id } });
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
      if (!blog) return res.status(404).send('Blog not found');
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
      const { title, subtitle, description } = req.body;
      const update = {
          title: title,
          subtitle: subtitle,
          description: description
      };
      if (req.file) {
          update.image = req.file.filename;
      }
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
  try {
      const { title, subtitle, description } = req.body;
      await blogs.create({
          title: title,
          subtitle: subtitle,
          description: description,
          image: req.file.filename
      });
      res.redirect('/');
  } catch (error) {
      console.error('Error in createBlog:', error);
      res.status(500).send('Internal Server Error');
  }
};


