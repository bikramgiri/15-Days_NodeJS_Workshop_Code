const { blogs } = require("../model");

exports.isValidUser = async (req, res, next) => {
  try {
    const id = req.params.id;
    const userId = req.userId; // Get the authenticated user's ID from the request object
    const blog = await blogs.findAll({
        where: {
            id: id
        }
    });
    if(blog[0].userId !== userId){ // Check if the blog's userId matches the authenticated user's ID
        return res.send("You are not authorized to edit this blog"); // If not, return an error response
    }
    next();
  } catch {
    console.error('Error in isValidUser:', error);
    res.status(500).send('Internal Server Error');
  }
}



// for delete
// exports.isValidUser = async (req, res, next) => {
//       const id = req.params.id
//       const userId = req.userId; // Get the authenticated user's ID from the request object
//       const blog = await blogs.findAll({
//           where: {
//               id: id
//           }
//       });
//       if(blog[0].userId !== userId){ // Check if the blog's userId matches the authenticated user's ID
//           return res.send("You are not authorized to delete this blog"); // If not, return an error response
//       }
//       next();
// }


