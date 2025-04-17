const { homePage, singleBlog, deleteBlog, editBlog, updateBlog, createBlogPage, createBlog, myBlogPage } = require("../controller/blogController");
const { isAuthenticated } = require("../middleware/isAuthenticated");
const {multer,storage} = require('../middleware/multerConfig') 
const upload = multer({storage: storage}) 

const router = require("express").Router(); 

router.route("/").get(homePage)
router.route("/blog/:id").get(singleBlog)
router.route("/delete/:id").get(isAuthenticated,deleteBlog)
router.route("/edit/:id").get(isAuthenticated,editBlog)
router.route("/update/:id").post(upload.single("image"),isAuthenticated,updateBlog)
router.route("/create").get(createBlogPage).post(upload.single("image"),isAuthenticated,createBlog)
router.route("/myblogs").get(isAuthenticated,myBlogPage)

module.exports = router; 