const { homePage, singleBlog, deleteBlog, editBlog, updateBlog, createBlogPage, createBlog, myBlogPage } = require("../controller/blogController");
const { isAuthenticated } = require("../middleware/isAuthenticated");
const {multer,storage} = require('../middleware/multerConfig') 
const upload = multer({storage: storage}) 

const router = require("express").Router(); 

router.route("/").get(homePage)
router.route("/blog/:id").get(singleBlog)
router.route("/delete/:id").get(isAuthenticated,deleteBlog)
router.route("/edit/:id").get(isAuthenticated,editBlog)
router.route("/update/:id").post(isAuthenticated,upload.single("image"),updateBlog)
router.route("/create").get(isAuthenticated,createBlogPage).post(isAuthenticated,upload.single("image"),createBlog)
router.route("/myblogs").get(isAuthenticated,myBlogPage)

module.exports = router; 